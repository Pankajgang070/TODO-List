
exports.dayDetails = function () {

    const today = new Date();
        const options = {
            weekday : "long" , 
            day : "numeric" ,
            month : "long" 
        };
        return today.toLocaleDateString("en-US",options) ;
}

exports.dayName = function () {

     const today = new Date();
        const options = {
             weekday : "long" , 
        };
        return today.toLocaleDateString("en-US",options) ;
}