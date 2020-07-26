using Newtonsoft.Json;

namespace PlanningRoom.Web.Models.Notifications
{
    public class ClientNotificationRequest
    {
        [JsonProperty("roomId")]
        public string RoomId { get; set; }

        [JsonProperty("userId")]
        public string UserId { get; set; }
    }
}
