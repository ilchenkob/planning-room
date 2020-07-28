using System;
using System.Linq;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using PlanningRoom.Web.Models.Notifications;
using PlanningRoom.Web.Services;

namespace PlanningRoom.Web
{
    internal class RoomHub : Hub
    {
        private static readonly ConcurrentDictionary<string, ClientNotificationRequest> _clients
             = new ConcurrentDictionary<string, ClientNotificationRequest>();

        private readonly IRoomService _roomService;

        internal static class Notifications
        {
            public const string StoriesUpdate = "StoriesUpdate";
            public const string MembersUpdate = "MembersUpdate";
            public const string DisconnectMember = "DisconnectMember";
            public const string SetCurrentStory = "SetCurrentStory";
            public const string StartTimer = "StartTimer";
            public const string StopTimer = "StopTimer";
            public const string UpdateRoomSettings = "UpdateRoomSettings";
        }

        public RoomHub(IRoomService roomService)
        {
            _roomService = roomService;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await DisconnectClient(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public Task JoinRoom(ClientNotificationRequest request)
        {
            if (request != null && !request.RoomId.IsNullOrEmpty())
            {
                _clients.TryAdd(Context.ConnectionId, request);

                return Groups.AddToGroupAsync(Context.ConnectionId, request.RoomId);
            }

            return Task.CompletedTask;
        }

        public async Task DisconnectUser(ClientNotificationRequest request)
        {
            var connectionId = _clients.FirstOrDefault(i => i.Value.RoomId == request.RoomId
                                                            && i.Value.UserId == request.UserId).Key;
            if (!connectionId.IsNullOrEmpty())
            {
                await DisconnectClient(connectionId);
                await Clients.Client(connectionId).SendAsync(Notifications.DisconnectMember);
            }
        }

        private async Task DisconnectClient(string connectionId)
        {
            if (_clients.TryGetValue(connectionId, out ClientNotificationRequest request)
                && request != null
                && !request.RoomId.IsNullOrEmpty())
            {
                _clients.TryRemove(connectionId, out ClientNotificationRequest _);
                await Groups.RemoveFromGroupAsync(connectionId, request.RoomId);

                await _roomService.RemoveFromRoom(request.RoomId, request.UserId);
            }
        }
    }
}
