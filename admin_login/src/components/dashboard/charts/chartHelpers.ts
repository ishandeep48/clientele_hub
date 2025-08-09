export const getMonthlyCountFromData = (data: any[]) => {
  const monthlyCount: { [month: string]: number } = {};

  data.forEach((item: any) => {
    const date = new Date(
      item.date || item.createdAt || item.orderDate || item.billDate
    );
    if (!isNaN(date.getTime())) {
      const month = date.toLocaleString("default", { month: "short" });
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    }
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return months.map((month) => ({
    month,
    total: monthlyCount[month] || 0
  }));
};
