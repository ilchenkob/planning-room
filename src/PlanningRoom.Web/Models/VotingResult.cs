using Newtonsoft.Json;

namespace PlanningRoom.Web.Models
{
    public class VotingResult
    {
        [JsonProperty("card")]
        public int Card { get; set; }

        [JsonProperty("amount")]
        public int Amount { get; set; }
    }
}
