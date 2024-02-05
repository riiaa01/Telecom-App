const calculatePlanDates = user => {
    // Assuming plansAssociated is an array of objects with plan and activationDate properties
    const latestPlan = user.plansAssociated.reduce((prev, current) =>
      prev.activationDate > current.activationDate ? prev : current
    );
 
    const activationDate =
      latestPlan && latestPlan.activationDate
        ? new Date(latestPlan.expirationDate)
        : new Date(); // Set to the current date if no plans or all plans expired
 
    const expirationDate = new Date(activationDate);
    expirationDate.setDate(expirationDate.getDate() + 30); // Assuming plans are valid for 30 days
 
    return { activationDate, expirationDate };
  };
 
  const getStatus = (activationDate, expirationDate) => {
    const currentDate = new Date();
 
    if (currentDate < activationDate) {
      return 'Upcoming';
    } else if (currentDate >= activationDate && currentDate <= expirationDate) {
      return 'Active';
    } else {
      return 'Expired';
    }
  };
 
  module.exports = { calculatePlanDates, getStatus };