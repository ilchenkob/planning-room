using Newtonsoft.Json;

namespace PlanningRoom.Web.Models
{
    public class RoomSettings
    {
        [JsonProperty("votingTimeSec")]
        public int VotingTimeSec { get; set; }

        [JsonProperty("storyBaseLink")]
        public string StoryBaseLink { get; set; }

        [JsonProperty("availableCards")]
        public int[] AvailableCards { get; set; }
    }
}
