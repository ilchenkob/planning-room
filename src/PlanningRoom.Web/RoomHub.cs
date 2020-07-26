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
            if (_clients.TryGetValue(Context.ConnectionId, out ClientNotificationRequest request))
            {
                await _roomService.RemoveFromRoom(request.RoomId, request.UserId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public Task JoinRoom(ClientNotificationRequest request)
        {
            _clients.TryAdd(Context.ConnectionId, request);

            return Groups.AddToGroupAsync(Context.ConnectionId, request.RoomId);
        }

        public Task DisconnectUser(ClientNotificationRequest request)
        {
            var connectionId = _clients.FirstOrDefault(i => i.Value.RoomId == request.RoomId
                                                            && i.Value.UserId == request.UserId).Key;
            return connectionId.IsNullOrEmpty()
                ? Task.CompletedTask
                : Clients.Client(connectionId).SendAsync(Notifications.DisconnectMember);
        }
    }
}
