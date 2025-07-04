import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { Call } from '../../interfaces/call.interface';

@Component({
  selector: 'app-calls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  calls: Call[] = [];
  filteredCalls: Call[] = [];
  searchTerm: string = '';
  typeFilter: string = '';
  statusFilter: string = '';

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.loadCalls();
  }

  loadCalls() {
    this.mockDataService.getCalls().subscribe(calls => {
      this.calls = calls;
      this.filteredCalls = calls;
    });
  }

  filterCalls() {
    this.filteredCalls = this.calls.filter(call => {
      const matchesSearch = call.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           call.userId.includes(this.searchTerm);
      const matchesType = !this.typeFilter || call.type === this.typeFilter;
      const matchesStatus = !this.statusFilter || call.status === this.statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  formatDuration(seconds: number): string {
    if (seconds === 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      'completed': 'bg-primary-100 text-primary-800',
      'missed': 'bg-red-100 text-red-800',
      'ongoing': 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  }
}