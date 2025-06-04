export const calculateFine = (dueDate)=>{
    const finePerHour = 10 //rupee
    const today = new Date();
    if(today>dueDate){
        const lateHour = Math.ceil((today-dueDate)/(1000*60*60));
        const fine = lateHour*finePerHour;
        return fine;
    }
    return 0;
}