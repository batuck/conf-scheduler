// BookingDto.js
class BookingDto {
    constructor(startDateTime, endDateTime, headcount,isCreate) {
      this.startDateTime = startDateTime;
      this.endDateTime = endDateTime;
      this.headcount = headcount;
      this.isCreate = isCreate;
    }
  }
  
  export default BookingDto;
  