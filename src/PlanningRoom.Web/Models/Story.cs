using System.Collections.Generic;
using Newtonsoft.Json;

namespace PlanningRoom.Web.Models
{
    public class Story
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("storyId")]
        public string StoryId { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("link")]
        public string Link { get; set; }

        [JsonProperty("storyPoints")]
        public int StoryPoints { get; set; }

        [JsonProperty("votes")]
        public List<VotingResult> Votes { get; set; }
    }
}
