export const getMonthlyTotals = (key: string, field: string): { month: string; total: number }[] => {
  const items = JSON.parse(localStorage.getItem(key) || "[]");

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    total: 0,
  }));

  items.forEach((item: any) => {
    const date = new Date(item.date || item.orderDate || item.paymentDate || item.createdAt);
    const monthIndex = date.getMonth();
    months[monthIndex].total += parseFloat(item[field]) || 0;
  });

  return months;
};

export const getMonthlyCount = (key: string): { month: string; total: number }[] => {
  const items = JSON.parse(localStorage.getItem(key) || "[]");

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    total: 0,
  }));

  items.forEach((item: any) => {
    const date = new Date(item.createdAt || item.date);
    const monthIndex = date.getMonth();
    months[monthIndex].total += 1;
  });

  return months;
};
