import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessRequestsService } from '../../services/access-requests.service';
import { Chart, ChartDataset, ChartOptions, ChartType, ChartData } from 'chart.js';
// Import required controllers, elements, and scales
import { ChangeDetectorRef } from '@angular/core'
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { AnalyticsService } from '../../services/analytics.service';

// Register them globally
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, MatCardModule, MatGridListModule, BaseChartDirective
  ],
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent {
    constructor(
      public analyticsService: AnalyticsService,
      private cdr: ChangeDetectorRef
    ) {}

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    messagesPerDay:any[] = [];
    messagesChartDataArray: number[] = [];

    barChartType: 'bar' = 'bar';
    chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#555', font: { size: 14 } } },
            title: { display: true, text: 'Messages per Day', font: { size: 16 }, color: '#222' },
            tooltip: {
                enabled: true,
                backgroundColor: '#333',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                ticks: { color: '#333', stepSize: 1 },
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: { 
                ticks: { color: '#333', font: { weight: 'bold' } },
                grid: { display: false }
            }
        }
    };

    ngOnInit(){
        this.loadMessagesPerDayData();
    }

    // Messages per day
    messagesChartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    messagesChartData: ChartData<'bar'> = {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [
            { data: [], label: 'Messages', backgroundColor: '#3f51b5' }
        ]
    };

    loadMessagesPerDayData() {
        this.analyticsService.getMessagesPerDay().subscribe({
            next: (res: any[]) => {
            const weeklyData = new Array(7).fill(0);
            const dayIndexMap = { 'Mon':0,'Tue':1,'Wed':2,'Thu':3,'Fri':4,'Sat':5,'Sun':6 };
            res.forEach(item => {
                const index = dayIndexMap[item.dayName as keyof typeof dayIndexMap];
                if (index !== undefined) weeklyData[index] = item.messagesSent;
            });

            this.messagesChartData.datasets[0].data = weeklyData;
            this.chart?.update();

            // Inform Angular to check for changes
            this.cdr.detectChanges();
            }
        });
    }

}