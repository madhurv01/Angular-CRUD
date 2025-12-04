import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

  employees: any[] = [];

  ngOnInit() {
    const saved = localStorage.getItem("employees");
    this.employees = saved ? JSON.parse(saved) : [];

    this.renderActiveInactiveChart();
    this.renderDepartmentChart();
  }

  renderActiveInactiveChart() {
    const active = this.employees.filter(e => e.active).length;
    const inactive = this.employees.filter(e => !e.active).length;

    new Chart("activeInactiveChart", {
      type: 'pie',
      data: {
        labels: ["Active", "Inactive"],
        datasets: [{
          data: [active, inactive],
          backgroundColor: ["#4CAF50", "#F44336"],
          borderWidth: 0
        }]
      }
    });
  }

  renderDepartmentChart() {
    const deptMap: any = {};

    this.employees.forEach(e => {
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });

    const labels = Object.keys(deptMap);
    const values = Object.values(deptMap);

    new Chart("departmentChart", {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Employees",
          data: values,
          backgroundColor: "#4285F4",
          borderRadius: 8
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
