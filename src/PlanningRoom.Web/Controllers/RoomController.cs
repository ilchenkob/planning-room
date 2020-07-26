using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlanningRoom.Web.Models;
using PlanningRoom.Web.Services;

namespace PlanningRoom.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpPost]
        public ActionResult<Room> CreateRoom([FromBody] Room room)
        {
            if (IsRoomNotValid(room))
                return BadRequest();

            return _roomService.CreateRoom(room);
        }

        [HttpPatch]
        public async Task<ActionResult> UpdateRoom([FromBody] Room room)
        {
            if (IsRoomNotValid(room))
                return BadRequest();

            await _roomService.UpdateRoom(room);

            return Ok();
        }

        [HttpPut("{roomId}")]
        public Task<ActionResult> AddStory(string roomId, [FromBody] Story story)
        {
            return UpdateStoryList(roomId, story, (id, s) =>
            {
                return _roomService.AddStory(id, s);
            });
        }

        [HttpPatch("{roomId}")]
        public Task<ActionResult> EditStory(string roomId, [FromBody] Story story)
        {
            return UpdateStoryList(roomId, story, (id, s) =>
            {
                return _roomService.EditStory(id, s);
            });
        }

        [HttpDelete("{roomId}/{storyId}")]
        public Task<ActionResult> DeleteStory(string roomId, string storyId)
        {
            return UpdateStoryList(roomId, storyId, (id, s) =>
            {
                return _roomService.DeleteStory(id, s);
            });
        }

        [HttpPatch("{roomId}/{storyId}")]
        public Task<ActionResult> SelectStory(string roomId, string storyId)
        {
            return UpdateStoryList(roomId, storyId, (id, s) =>
            {
                return _roomService.SelectStory(id, s);
            });
        }

        [HttpPut("{roomId}/participants")]
        public async Task<ActionResult<Room>> JoinRoom(string roomId, [FromBody] TeamMember member)
        {
            if (roomId.IsNullOrEmpty()
                || member == null
                || member.Name.IsNullOrEmpty())
            {
                return BadRequest();
            }

            var room = await _roomService.JoinRoom(roomId, member);
            if (room == null)
            {
                return BadRequest();
            }

            return room;
        }

        [HttpPatch("{roomId}/participants/{participantId}")]
        public async Task<ActionResult> Vote(string roomId, string participantId, [FromBody] Vote vote)
        {
            if (roomId.IsNullOrEmpty()
                || participantId.IsNullOrEmpty()
                || vote == null)
            {
                return BadRequest();
            }

            await _roomService.SetSelectedCard(roomId, participantId, vote.SelectedCard);

            return Ok();
        }

        [HttpPost("{roomId}/timer")]
        public async Task<ActionResult> StartTimer(string roomId)
        {
            if (roomId.IsNotAdminRoomId())
            {
                return BadRequest();
            }

            await _roomService.StartTimer(roomId);

            return Ok();
        }

        [HttpDelete("{roomId}/timer")]
        public async Task<ActionResult> StopTimer(string roomId)
        {
            if (roomId.IsNotAdminRoomId())
            {
                return BadRequest();
            }

            await _roomService.StopTimer(roomId);

            return Ok();
        }

        [HttpDelete("{roomId}/participants/cards")]
        public async Task<ActionResult> ResetCards(string roomId)
        {
            if (roomId.IsNotAdminRoomId())
            {
                return BadRequest();
            }

            await _roomService.ResetCards(roomId);

            return Ok();
        }

        [HttpPut("{roomId}/storypoints")]
        public Task<ActionResult> SetStoryPoints(string roomId, [FromBody]Story story)
        {
            return UpdateStoryList(roomId, story, (id, s) =>
            {
                return _roomService.SetStoryPoints(id, s);
            });
        }

        private async Task<ActionResult> UpdateStoryList(
            string roomId, Story story, Func<string, Story, Task> updateFunc)
        {
            if (roomId.IsNotAdminRoomId()
                || story == null
                || story.Id.IsNullOrEmpty()
                || story.Title.IsNullOrEmpty())
            {
                return BadRequest();
            }

            await updateFunc(roomId, story);

            return Ok();
        }

        private async Task<ActionResult> UpdateStoryList(
            string roomId, string storyId, Func<string, string, Task> updateFunc)
        {
            if (roomId.IsNotAdminRoomId() || storyId.IsNullOrEmpty())
            {
                return BadRequest();
            }

            await updateFunc(roomId, storyId);

            return Ok();
        }

        private bool IsRoomNotValid(Room room)
        {
            return room == null
                || room.Title.IsNullOrEmpty()
                || room.Settings == null
                || room.Settings.VotingTimeSec < 5
                || room.Settings.AvailableCards == null
                || room.Settings.AvailableCards.Length == 0;
        }
    }
}
