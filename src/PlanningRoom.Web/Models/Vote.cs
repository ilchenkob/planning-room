using Newtonsoft.Json;

namespace PlanningRoom.Web.Models
{
    public class Vote
    {
        [JsonProperty("selectedCard")]
        public int SelectedCard { get; set; }
    }
}
