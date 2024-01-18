// BookingDTO.js
class BookingDTO {
    constructor(startDateTime, endDateTime, headcount,isCreate) {
      this.startDateTime = startDateTime;
      this.endDateTime = endDateTime;
      this.headcount = headcount;
      this.isCreate = isCreate;
    }
  }
  
  export default BookingDTO;
  