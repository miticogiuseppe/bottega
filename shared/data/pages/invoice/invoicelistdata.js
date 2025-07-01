
export const Manageinvoices = [
  { id: "1", src: '../../../assets/images/faces/11.jpg', name: 'Henry Milo', mail: 'henrymilo2416@gmail.com', invoiceid: '#SHG20241323', amount: '$898.12', status: 'Paid', issueddate: '13,Mar 2024', duedate: '25,May 2024', color: 'success' },
  { id: "2", src: '../../../assets/images/faces/7.jpg', name: 'Priya Riva', mail: 'priyariva3214@gmail.com', invoiceid: '#SHG20244578', amount: '$235.52', status: 'Pending', issueddate: '26,Apr 2024', duedate: '13,May 2024', color: 'warning' },
  { id: "3", src: '../../../assets/images/faces/15.jpg', name: 'Calvin James', mail: 'calvinjames143@gmail.com', invoiceid: '#SHG20240012', amount: '$4872.41', status: 'Overdue', issueddate: '30,Mar 2024', duedate: '30,May 2024', color: 'danger' },
  { id: "4", src: '../../../assets/images/faces/12.jpg', name: 'Sebastian Leo', mail: 'Sebastian Leo@gmail.com', invoiceid: '#SHG20246631', amount: '$457.56', status: 'Paid', issueddate: '18,Mar 2024', duedate: '18,May 2024', color: 'success' },
  { id: "5", src: '../../../assets/images/faces/4.jpg', name: 'Anna Angel', mail: 'annaangel114@gmail.com', invoiceid: '#SHG20249897', amount: '$2,568.66', status: 'Due By 1 Day', issueddate: '18,Mar 2024', duedate: '	18,May 2024', color: 'primary' },
  { id: "6", src: '../../../assets/images/faces/7.jpg', name: 'Rani Advitha', mail: 'raniadvitha87@gmail.com', invoiceid: '#SHG20245757', amount: '$7896.36', status: 'Paid', issueddate: '02,Mar 2024', duedate: '18,May 2024', color: 'success' },
  { id: "7", src: '../../../assets/images/faces/9.jpg', name: 'Helma Finlee', mail: 'helmafinlee@gmail.com', invoiceid: '#SHG20246301', amount: '$1,999.99', status: 'Paid', issueddate: '15,Nov 2024', duedate: '15,May 2024', color: 'success' },
  { id: "8", src: '../../../assets/images/faces/13.jpg', name: 'Robert Max', mail: 'robertmax@gmail.com', invoiceid: '#SHG20241603', amount: '$2,985.33', status: 'Pending', issueddate: '21,Mar 2024', duedate: '21,May 2024', color: 'warning' },
  { id: "9", src: '../../../assets/images/faces/8.jpg', name: 'Alisa Juliet', mail: 'alisajuliet555@gmail.com', invoiceid: '#SHG20242434', amount: '$1,841.60', status: 'Paid', issueddate: '08,Jul 2024', duedate: '15,Mar 2024', color: 'success' }
]

//INVOICE STATISTICS
export const Invoiceseries = [{
  name: 'Total Invoices',
  data: [56, 55, 25, 65, 89, 45, 65, 56, 78, 45, 56, 48],
}, {
  name: 'Paid Invoices',
  data: [56, 89, 45, 48, 44, 35, 48, 56, 89, 46, 75, 42],
}, {
  name: 'Pending Invoices',
  data: [75, 86, 35, 24, 68, 57, 94, 95, 78, 48, 68, 99],
}, {
  name: 'Overdue Invoices',
  data: [89, 44, 62, 77, 24, 65, 48, 39, 47, 46, 57, 88],
}]
export const Invoiceoptions = {
  chart: {
    type: "bar",
    height: 263,
    stacked: true,
    toolbar: {
      show: false,
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '25%',
      borderRadius: 1,
    }
  },
  grid: {
    show: false,
    borderColor: '#f2f6f7',
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["rgba(255, 142, 111, 1)", "rgba(255, 93, 159, 1)", "rgba(227, 84, 212, 1)", "var(--primary-color)"],
  stroke: {
    width: 0,
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'center',
    markers: {
      width: [5],
      height: [5],
      shape: "circle",
      strokeWidth: 0
    }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
    labels: {
      show: true,
      style: {
        colors: "#8c9097",
        fontSize: "10px",
        fontWeight: 500,
        cssClass: "apexcharts-xaxis-label",
      },
    },
  },
  yaxis: {
    title: {
      style: {
        color: "#8c9097",
      },
    },
    labels: {
      show: true,
      style: {
        colors: "#8c9097",
        fontSize: "11px",
        fontWeight: 500,
        cssClass: "apexcharts-xaxis-label",
      },
    },
  },
}
