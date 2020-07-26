using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using PlanningRoom.Web.Models;

namespace PlanningRoom.Web.Services
{
    internal class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly IHubContext<RoomHub> _notificationHubContext;

        public NotificationService(
            IHubContext<RoomHub> notificationHubContext,
            ILogger<NotificationService> logger)
        {
            _notificationHubContext = notificationHubContext;
            _logger = logger;
        }

        public Task NotifyParticipants(string roomId, string notification)
        {
            return GetRoomMembers(roomId).SendAsync(notification);
        }

        public Task NotifyParticipantsChange(string roomId, bool isVoting, IEnumerable<TeamMember> participants)
        {
            var payload = isVoting
                ? participants.Select(p =>
                {
                    var t = p.Copy();
                    if (t.SelectedCard != 0)
                        t.SelectedCard = 999;

                    return t;
                })
                : participants;

            return GetRoomMembers(roomId)
                    .SendAsync(RoomHub.Notifications.MembersUpdate, payload);
        }

        public Task NotifyCurrentStoryChange(string roomId, Story story)
        {
            return GetRoomMembers(roomId)
                    .SendAsync(RoomHub.Notifications.SetCurrentStory, story);
        }

        public Task NotifyStoriesChange(string roomId, IEnumerable<Story> stories)
        {
            return GetRoomMembers(roomId)
                    .SendAsync(RoomHub.Notifications.StoriesUpdate, stories);
        }

        public Task NotifyRoomSettingsChange(string roomId, RoomSettings settings)
        {
            return GetRoomMembers(roomId)
                    .SendAsync(RoomHub.Notifications.UpdateRoomSettings, settings);
        }

        private IClientProxy GetRoomMembers(string roomId) =>
            _notificationHubContext.Clients.Group(roomId);
    }
}
