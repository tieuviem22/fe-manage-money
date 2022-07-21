import moment from 'moment';
export const convertDate = (date: string) => {
  if(!date) return ''
  let justDate = date.split('T')[0]
  let month = moment(justDate).format('MMMM');
  let day = moment(justDate).format('DD');
  let year = moment(justDate).format('YYYY');
  return `${day} ${month}, ${year}` || '';
}
export const getAllDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    dates.push(new Date(date)+"");
    date.setDate(date.getDate() + 1);
  }
  return dates;
}
export const fomatNumber = (n: number) => {
  return (Math. round(n * 100) / 100). toLocaleString() ;
}


