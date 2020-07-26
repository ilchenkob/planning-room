using Newtonsoft.Json;

namespace PlanningRoom.Web.Models
{
    public class TeamMember
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("isScrumMaster")]
        public bool IsScrumMaster { get; set; }

        [JsonProperty("selectedCard")]
        public int SelectedCard { get; set; }

        public TeamMember Copy() => new TeamMember
        {
            Id = this.Id,
            Name = this.Name,
            IsScrumMaster = this.IsScrumMaster,
            SelectedCard = this.SelectedCard
        };
    }
}
