const currentMonth = () => {
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const uppercaseMonth = currentMonthName.toUpperCase();

  return uppercaseMonth;
};

export default currentMonth;
