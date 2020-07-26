using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace PlanningRoom.Web.Models
{
    public class Room
    {
        [JsonProperty("roomId")]
        public string Id { get; set; }

        [JsonProperty("adminRoomId")]
        public string AdminId { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("settings")]
        public RoomSettings Settings { get; set; }

        [JsonProperty("isVoting")]
        public bool IsVoting { get; set; }

        [JsonProperty("currentStory")]
        public Story CurrentStory { get; set; }

        [JsonProperty("stories")]
        public List<Story> Stories { get; set; }

        [JsonProperty("participants")]
        public List<TeamMember> Participants { get; set; }

        public Room Copy() => new Room
        {
            Id = this.Id,
            AdminId = this.AdminId,
            Title = this.Title,
            IsVoting = this.IsVoting,
            CurrentStory = this.CurrentStory,
            Settings = this.Settings,
            Stories = this.Stories.ToList(),
            Participants = this.Participants.ToList()
        };
    }
}
