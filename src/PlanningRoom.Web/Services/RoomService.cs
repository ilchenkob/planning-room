using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PlanningRoom.Web.Models;

namespace PlanningRoom.Web.Services
{
    internal class RoomService : IRoomService
    {
        private readonly ILogger<RoomService> _logger;
        private readonly INotificationService _notificationService;
        private readonly IStorageService _storage;

        public RoomService(
            INotificationService notificationService,
            ILogger<RoomService> logger,
            IStorageService storage)
        {
            _notificationService = notificationService;
            _logger = logger;
            _storage = storage;
        }

        public Task AddStory(string roomId, Story story)
        {
            return UpdateStoryList(roomId, room => room.Stories.Add(story));
        }

        public Task EditStory(string roomId, Story story)
        {
            return UpdateStoryList(roomId, room =>
            {
                var s = room.Stories.FirstOrDefault(i => i.Id == story.Id);

                s.StoryId = story.StoryId;
                s.Title = story.Title;
                s.Link = story.Link;
            });
        }

        public Task SetStoryPoints(string roomId, Story story)
        {
            return UpdateStoryList(roomId, room =>
            {
                var s = room.Stories.FirstOrDefault(i => i.Id == story.Id);
                s.StoryPoints = story.StoryPoints;
            });
        }

        public async Task DeleteStory(string roomId, string storyId)
        {
            var notificationRoomId = "";
            Story selectedStory = null;

            await UpdateStoryList(roomId, room =>
            {
                var storyIndex = room.Stories.FindIndex(i => i.Id == storyId);
                if (storyIndex >= 0)
                {
                    if (room.Stories.Count == 1)
                    {
                        room.CurrentStory = null;
                    }
                    else if (storyIndex == room.Stories.Count - 1)
                    {
                        room.CurrentStory = room.Stories.ElementAt(storyIndex - 1);
                    }
                    else
                    {
                        room.CurrentStory = room.Stories.ElementAt(storyIndex + 1);
                    }

                    room.Stories.RemoveAt(storyIndex);

                    notificationRoomId = room.Id;
                    selectedStory = room.CurrentStory;
                }
            });

            if (!notificationRoomId.IsNullOrEmpty())
            {
                await _notificationService.NotifyCurrentStoryChange(notificationRoomId, selectedStory);
            }
        }

        public Task SelectStory(string roomId, string storyId)
        {
            var notificationRoomId = "";
            Story selectedStory = null;

            _storage.UpdateRoom(roomId, room =>
            {
                if (room.AdminId == roomId)
                {
                    selectedStory = room.Stories.FirstOrDefault(s => s.Id == storyId);
                    room.CurrentStory = selectedStory;

                    notificationRoomId = room.Id;
                }
            });

            return !string.IsNullOrWhiteSpace(notificationRoomId)
                ? _notificationService.NotifyCurrentStoryChange(notificationRoomId, selectedStory)
                : Task.CompletedTask;
        }

        public Room CreateRoom(Room room)
        {
            room.Id = Helpers.CreateShortId();
            room.AdminId = Helpers.CreateLongId();
            room.Participants = new List<TeamMember>();
            room.Stories = new List<Story>();

            _storage.SetRoom(room);

            return room;
        }

        public Task UpdateRoom(Room room)
        {
            var notificationRoomId = "";

            _storage.UpdateRoom(room.Id, r =>
            {
                r.Settings.VotingTimeSec = room.Settings.VotingTimeSec;
                r.Settings.StoryBaseLink = room.Settings.StoryBaseLink;
                r.Settings.AvailableCards = room.Settings.AvailableCards;

                notificationRoomId = room.Id;
            });

            return notificationRoomId.IsNullOrEmpty()
                ? Task.CompletedTask
                : _notificationService.NotifyRoomSettingsChange(notificationRoomId, room.Settings);
        }

        public async Task<Room> JoinRoom(string roomId, TeamMember member)
        {
            member.SelectedCard = 0;
            member.IsScrumMaster = roomId.IsAdminRoomId();

            Room result = null;

            _storage.UpdateRoom(roomId, room =>
            {
                room.Participants.Add(member);
                room.Participants = room.Participants.OrderBy(p => p.Name).ToList();

                result = room.Copy();
            });

            if (result != null)
            {
                if (result?.Participants != null)
                {
                    await _notificationService.NotifyParticipantsChange(result.Id, result.IsVoting, result.Participants);
                }
                if (roomId.Length < 16)
                {
                    result.AdminId = string.Empty;
                }
            }

            return result;
        }

        public Task RemoveFromRoom(string roomId, string memberId)
        {
            var notificationRoomId = "";
            var isVoting = false;
            IEnumerable<TeamMember> participants = null;

            _storage.UpdateRoom(roomId, room =>
            {
                var member = room.Participants.FirstOrDefault(m => m.Id == memberId);
                if (member != null)
                {
                    room.Participants.Remove(member);

                    participants = room.Participants;
                    notificationRoomId = room.Id;
                    isVoting = room.IsVoting;
                }
            });


            return participants != null
                ? _notificationService.NotifyParticipantsChange(notificationRoomId, isVoting, participants)
                : Task.CompletedTask;
        }

        public Task SetSelectedCard(string roomId, string memberId, int selectedCard)
        {
            var isVoting = false;
            IEnumerable<TeamMember> participants = null;

            _storage.UpdateRoom(roomId, room =>
            {
                var member = room.Participants.FirstOrDefault(m => m.Id == memberId);
                if (member != null)
                {
                    member.SelectedCard = selectedCard;
                    participants = room.Participants;
                }

                isVoting = room.IsVoting;
            });

            return participants != null
                ? _notificationService.NotifyParticipantsChange(roomId, isVoting, participants)
                : Task.CompletedTask;
        }

        public Task ResetCards(string roomId)
        {
            var notificationRoomId = "";
            var isVoting = false;
            IEnumerable<TeamMember> participants = null;

            _storage.UpdateRoom(roomId, room =>
            {
                foreach (var p in room.Participants)
                    p.SelectedCard = 0;

                participants = room.Participants;
                notificationRoomId = room.Id;
                isVoting = room.IsVoting;
            });

            return participants != null
                ? _notificationService.NotifyParticipantsChange(notificationRoomId, isVoting, participants)
                : Task.CompletedTask;
        }

        public Task StartTimer(string roomId)
        {
            return UpdateTimerState(roomId, isTimerLaunched: true);
        }

        public Task StopTimer(string roomId)
        {
            return UpdateTimerState(roomId, isTimerLaunched: false);
        }

        

        private Task UpdateTimerState(string roomId, bool isTimerLaunched)
        {
            var notificationRoomId = "";
            IEnumerable<TeamMember> participants = null;
            IEnumerable<Story> stories = null;

            _storage.UpdateRoom(roomId, room =>
            {
                room.IsVoting = isTimerLaunched;

                if (!isTimerLaunched)
                {
                    var votes = room.Participants
                                    .Where(p => p.SelectedCard != 0)
                                    .GroupBy(t => t.SelectedCard)
                                    .Select(g => new VotingResult
                                    {
                                        Card = g.Key,
                                        Amount = g.Count()
                                    })
                                    .OrderBy(r => r.Card)
                                    .ToList();

                    room.CurrentStory.Votes = votes;
                    stories = room.Stories;
                }

                notificationRoomId = room.Id;
                participants = room.Participants;
            });

            if (notificationRoomId.IsNullOrEmpty())
                return Task.CompletedTask;

            return isTimerLaunched
                ? _notificationService.NotifyParticipants(notificationRoomId, RoomHub.Notifications.StartTimer)
                : Task.WhenAll(
                    _notificationService.NotifyParticipants(notificationRoomId, RoomHub.Notifications.StopTimer),
                    _notificationService.NotifyParticipantsChange(notificationRoomId, false, participants),
                    _notificationService.NotifyStoriesChange(notificationRoomId, stories));
        }

        private Task UpdateStoryList(string roomId, Action<Room> updateAction)
        {
            var notificationRoomId = "";
            IEnumerable<Story> stories = null;

            _storage.UpdateRoom(roomId, room =>
            {
                if (room.AdminId == roomId)
                {
                    updateAction(room);

                    notificationRoomId = room.Id;
                    stories = room.Stories;
                }
            });

            return notificationRoomId.IsNullOrEmpty()
                ? Task.CompletedTask
                : _notificationService.NotifyStoriesChange(notificationRoomId, stories);
        }
    }
}
