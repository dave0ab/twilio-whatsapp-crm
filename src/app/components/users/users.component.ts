import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { SystemUser } from "../../interfaces/system-user.interface";
import { MockDataService } from "../../services/mock-data.service";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  systemUsers: SystemUser[] = [];
  filteredSystemUsers: SystemUser[] = [];
  searchTerm: string = "";
  roleFilter: string = "";
  statusFilter: string = "";
  departmentFilter: string = "";
  showAddUserForm: boolean = false;

  newSystemUser: Partial<SystemUser> = {
    name: "",
    email: "",
    username: "",
    role: "agent",
    department: "",
    phone: "",
  };

  constructor(
    private mockDataService: MockDataService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSystemUsers();
  }

  loadSystemUsers() {
    this.mockDataService.getSystemUsers().subscribe((users) => {
      this.systemUsers = users;
      this.filteredSystemUsers = [...this.systemUsers];
    });
  }

  filterSystemUsers() {
    this.filteredSystemUsers = this.systemUsers.filter((user) => {
      const matchesSearch =
        !this.searchTerm ||
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      const matchesStatus =
        !this.statusFilter || user.status === this.statusFilter;
      const matchesDepartment =
        !this.departmentFilter || user.department === this.departmentFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });
  }

  getRoleStyle(role: string): string {
    const styles: { [key: string]: string } = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-purple-100 text-purple-800",
      agent: "bg-blue-100 text-blue-800",
      support: "bg-green-100 text-green-800",
    };
    return styles[role] || "bg-gray-100 text-gray-800";
  }

  getStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      suspended: "bg-yellow-100 text-yellow-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  }

  getOnlineStatusStyle(isOnline: boolean): string {
    return isOnline
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  }

  editSystemUser(user: SystemUser) {
    this.notificationService.show(
      "Edit user functionality coming soon",
      "info"
    );
  }

  deleteSystemUser(user: SystemUser) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.mockDataService.deleteSystemUser(user.id).subscribe((success) => {
        if (success) {
          this.loadSystemUsers();
          this.notificationService.show("User deleted successfully", "success");
        } else {
          this.notificationService.show("Failed to delete user", "error");
        }
      });
    }
  }

  toggleUserStatus(user: SystemUser) {
    const newStatus = user.status === "active" ? "inactive" : "active";
    this.mockDataService
      .updateSystemUser(user.id, { status: newStatus })
      .subscribe((updatedUser) => {
        this.loadSystemUsers();
        this.notificationService.show(
          `User status updated to ${newStatus}`,
          "success"
        );
      });
  }

  addSystemUser() {
    if (
      this.newSystemUser.name &&
      this.newSystemUser.email &&
      this.newSystemUser.username &&
      this.newSystemUser.role
    ) {
      this.mockDataService
        .createSystemUser(this.newSystemUser)
        .subscribe((newUser) => {
          this.loadSystemUsers();
          this.showAddUserForm = false;
          this.resetNewSystemUser();
          this.notificationService.show(
            "System user added successfully",
            "success"
          );
        });
    } else {
      this.notificationService.show(
        "Please fill in all required fields",
        "error"
      );
    }
  }

  resetNewSystemUser() {
    this.newSystemUser = {
      name: "",
      email: "",
      username: "",
      role: "agent",
      department: "",
      phone: "",
    };
  }

  getDepartments(): string[] {
    const departments = this.systemUsers
      .map((user) => user.department)
      .filter((dept): dept is string => dept !== undefined && dept !== null)
      .filter((dept, index, arr) => arr.indexOf(dept) === index);
    return departments;
  }

  formatLastLogin(lastLogin?: Date): string {
    if (!lastLogin) return "Never";
    const now = new Date();
    const diff = now.getTime() - lastLogin.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}
