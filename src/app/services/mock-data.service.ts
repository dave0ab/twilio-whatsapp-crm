import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { User } from "../interfaces/user.interface";
import { SystemUser } from "../interfaces/system-user.interface";
import { Call } from "../interfaces/call.interface";
import { Message } from "../interfaces/message.interface";
import { Order } from "../interfaces/order.interface";

@Injectable({
  providedIn: "root",
})
export class MockDataService {
  private users: User[] = [
    {
      id: "1",
      name: "John Smith",
      phone: "+1234567890",
      email: "john.smith@example.com",
      role: "patient",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      lastSeen: new Date(Date.now() - 2 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      messagesCount: 45,
      callsCount: 8,
      lastActivity: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phone: "+1234567891",
      email: "sarah.johnson@example.com",
      role: "patient",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      lastSeen: new Date(Date.now() - 10 * 60 * 1000),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      messagesCount: 23,
      callsCount: 3,
      lastActivity: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      id: "3",
      name: "Michael Brown",
      phone: "+1234567892",
      email: "michael.brown@example.com",
      role: "patient",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      lastSeen: new Date(Date.now() - 1 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      messagesCount: 156,
      callsCount: 12,
      lastActivity: new Date(Date.now() - 1 * 60 * 1000),
    },
    {
      id: "4",
      name: "Emily Davis",
      phone: "+1234567893",
      email: "emily.davis@example.com",
      role: "patient",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      messagesCount: 67,
      callsCount: 5,
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: "5",
      name: "Robert Wilson",
      phone: "+1234567894",
      email: "robert.wilson@example.com",
      role: "patient",
      status: "inactive",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      messagesCount: 34,
      callsCount: 2,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];

  private systemUsers: SystemUser[] = [
    {
      id: "sys_1",
      name: "Dr. Mike Wilson",
      email: "mike.wilson@healthcare.com",
      username: "mike.wilson",
      role: "admin",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      department: "Administration",
      permissions: [
        "dashboard",
        "users",
        "calls",
        "orders",
        "settings",
        "system_users",
      ],
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      phone: "+1234567890",
      isOnline: true,
      loginAttempts: 0,
      lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "sys_2",
      name: "Sarah Johnson",
      email: "sarah.johnson@healthcare.com",
      username: "sarah.johnson",
      role: "manager",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      department: "Patient Care",
      permissions: ["dashboard", "users", "calls", "orders"],
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      phone: "+1234567891",
      isOnline: false,
      loginAttempts: 0,
      lastPasswordChange: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: "sys_3",
      name: "David Chen",
      email: "david.chen@healthcare.com",
      username: "david.chen",
      role: "agent",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      department: "Support",
      permissions: ["dashboard", "users", "calls"],
      lastLogin: new Date(Date.now() - 15 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000),
      phone: "+1234567892",
      isOnline: true,
      loginAttempts: 0,
      lastPasswordChange: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      id: "sys_4",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@healthcare.com",
      username: "emily.rodriguez",
      role: "support",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      department: "Customer Service",
      permissions: ["dashboard", "users"],
      lastLogin: new Date(Date.now() - 45 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 45 * 60 * 1000),
      phone: "+1234567893",
      isOnline: false,
      loginAttempts: 0,
      lastPasswordChange: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "sys_5",
      name: "Robert Kim",
      email: "robert.kim@healthcare.com",
      username: "robert.kim",
      role: "agent",
      status: "inactive",
      avatar:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      department: "Support",
      permissions: ["dashboard", "users"],
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      phone: "+1234567894",
      isOnline: false,
      loginAttempts: 3,
      lastPasswordChange: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
  ];

  private calls: Call[] = [
    {
      id: "1",
      userId: "1",
      userName: "John Smith",
      userAvatar:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      type: "audio",
      duration: 480,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 480 * 1000),
      status: "completed",
      notes: "Patient consultation about test results",
    },
    {
      id: "2",
      userId: "2",
      userName: "Sarah Johnson",
      userAvatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      type: "video",
      duration: 0,
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: "missed",
      notes: "Patient did not answer",
    },
    {
      id: "3",
      userId: "3",
      userName: "Michael Brown",
      userAvatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      type: "audio",
      duration: 720,
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 720 * 1000),
      status: "completed",
      notes: "Follow-up consultation",
    },
    {
      id: "4",
      userId: "1",
      userName: "John Smith",
      userAvatar:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      type: "video",
      duration: 900,
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 6 * 60 * 60 * 1000 + 900 * 1000),
      status: "completed",
      notes: "Initial consultation",
    },
    {
      id: "5",
      userId: "4",
      userName: "Emily Davis",
      userAvatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      type: "audio",
      duration: 0,
      startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: "missed",
      notes: "Appointment reminder call",
    },
    {
      id: "6",
      userId: "2",
      userName: "Sarah Johnson",
      userAvatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      type: "audio",
      duration: 360,
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 12 * 60 * 60 * 1000 + 360 * 1000),
      status: "completed",
      notes: "Prescription refill discussion",
    },
  ];

  private messages: Message[] = [
    // John Smith messages
    {
      id: "1",
      userId: "1",
      content: "Hello, I need help with my test results.",
      type: "text",
      sender: "user",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
    },
    {
      id: "2",
      userId: "1",
      content:
        "Hi John! I'll help you with your test results. Can you please share your report?",
      type: "text",
      sender: "bot",
      timestamp: new Date(Date.now() - 29 * 60 * 1000),
      isRead: true,
    },
    {
      id: "3",
      userId: "1",
      content: "Here is my blood test report",
      type: "document",
      sender: "user",
      timestamp: new Date(Date.now() - 28 * 60 * 1000),
      fileName: "blood_test_report.pdf",
      fileSize: 1024000,
      fileUrl: "https://example.com/documents/blood_test_report.pdf",
      isRead: true,
    },
    {
      id: "4",
      userId: "1",
      content:
        "Thank you for sharing the report. I've reviewed it and everything looks normal. I'll schedule a follow-up call to discuss the details.",
      type: "text",
      sender: "agent",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      isRead: true,
    },
    // Sarah Johnson messages
    {
      id: "5",
      userId: "2",
      content: "I would like to schedule an appointment",
      type: "text",
      sender: "user",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "6",
      userId: "2",
      content:
        "I can help you schedule an appointment. What type of appointment do you need?",
      type: "text",
      sender: "bot",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 1000),
      isRead: true,
    },
    {
      id: "7",
      userId: "2",
      content: "General consultation with Dr. Smith",
      type: "text",
      sender: "user",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60 * 1000),
      isRead: true,
    },
    {
      id: "8",
      userId: "2",
      content:
        "Your appointment has been scheduled for tomorrow at 3 PM with Dr. Smith.",
      type: "text",
      sender: "bot",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: true,
    },
    // Michael Brown messages
    {
      id: "9",
      userId: "3",
      content: "I have my lab results ready",
      type: "text",
      sender: "user",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "10",
      userId: "3",
      content:
        "Great! Please upload your lab results and I'll have a doctor review them.",
      type: "text",
      sender: "bot",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 30 * 1000),
      isRead: true,
    },
    {
      id: "11",
      userId: "3",
      content: "Here are my test results",
      type: "document",
      sender: "user",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      fileName: "lab_results_2024.pdf",
      fileSize: 2048000,
      fileUrl: "https://example.com/documents/lab_results_2024.pdf",
    },
    // Emily Davis messages
    {
      id: "12",
      userId: "4",
      content: "Can I schedule a video consultation?",
      type: "text",
      sender: "user",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "13",
      userId: "4",
      content:
        "Of course! I can help you schedule a video consultation. What would be your preferred time?",
      type: "text",
      sender: "bot",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 30 * 1000),
      isRead: true,
    },
    {
      id: "14",
      userId: "4",
      content: "Tomorrow afternoon would be perfect",
      type: "text",
      sender: "user",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 60 * 1000),
      isRead: false,
    },
  ];

  private orders: Order[] = [
    {
      id: "1",
      userId: "1",
      userName: "John Smith",
      userPhone: "+1234567890",
      type: "lab_test",
      title: "Complete Blood Count",
      description: "Routine blood test for annual checkup",
      status: "completed",
      priority: "medium",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      assignedTo: "Dr. Mike Wilson",
      amount: 150,
    },
    {
      id: "2",
      userId: "2",
      userName: "Sarah Johnson",
      userPhone: "+1234567891",
      type: "consultation",
      title: "General Consultation",
      description: "General health consultation",
      status: "pending",
      priority: "high",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      amount: 200,
    },
    {
      id: "3",
      userId: "3",
      userName: "Michael Brown",
      userPhone: "+1234567892",
      type: "prescription",
      title: "Medication Refill",
      description: "Monthly prescription refill",
      status: "in_progress",
      priority: "medium",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      assignedTo: "Dr. Sarah Lee",
      amount: 75,
    },
    {
      id: "4",
      userId: "4",
      userName: "Emily Davis",
      userPhone: "+1234567893",
      type: "document_upload",
      title: "Medical Records Upload",
      description: "Upload previous medical records for review",
      status: "pending",
      priority: "low",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      amount: 25,
    },
  ];

  private dashboardStats = {
    totalMessages: 1247,
    totalCalls: 89,
    totalFiles: 234,
    totalOrders: 156,
    newUsers: 12,
    activeUsers: 45,
  };

  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(500));
  }

  getCalls(): Observable<Call[]> {
    return of(this.calls).pipe(delay(500));
  }

  getCallsByUserId(userId: string): Observable<Call[]> {
    return of(this.calls.filter((call) => call.userId === userId)).pipe(
      delay(300)
    );
  }

  getMessages(userId: string): Observable<Message[]> {
    return of(this.messages.filter((msg) => msg.userId === userId)).pipe(
      delay(500)
    );
  }

  getOrders(): Observable<Order[]> {
    return of(this.orders).pipe(delay(500));
  }

  getDashboardStats(): Observable<any> {
    return of(this.dashboardStats).pipe(delay(500));
  }

  getUserById(id: string): Observable<User | undefined> {
    return of(this.users.find((user) => user.id === id)).pipe(delay(300));
  }

  updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Observable<Order> {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      if (status === "completed") {
        order.completedAt = new Date();
      }
    }
    return of(order!).pipe(delay(500));
  }

  createUser(userData: Partial<User>): Observable<User> {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      name: userData.name || "",
      phone: userData.phone || "",
      email: userData.email,
      role: userData.role || "patient",
      status: "active",
      avatar: userData.avatar,
      createdAt: new Date(),
      messagesCount: 0,
      callsCount: 0,
      lastActivity: new Date(),
    };
    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  // Get user activity summary (calls + messages)
  getUserActivity(userId: string): Observable<{
    calls: Call[];
    messages: Message[];
    user: User | undefined;
  }> {
    const user = this.users.find((u) => u.id === userId);
    const userCalls = this.calls.filter((call) => call.userId === userId);
    const userMessages = this.messages.filter((msg) => msg.userId === userId);

    return of({
      calls: userCalls,
      messages: userMessages,
      user: user,
    }).pipe(delay(300));
  }

  // Get users with recent activity (for WhatsApp chatbot)
  getUsersWithRecentActivity(): Observable<User[]> {
    // Sort users by last activity and return those with recent messages or calls
    const activeUsers = this.users
      .filter((user) => {
        const hasRecentMessages = this.messages.some(
          (msg) =>
            msg.userId === user.id &&
            msg.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        const hasRecentCalls = this.calls.some(
          (call) =>
            call.userId === user.id &&
            call.startTime > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        return hasRecentMessages || hasRecentCalls;
      })
      .sort(
        (a, b) =>
          (b.lastActivity?.getTime() || 0) - (a.lastActivity?.getTime() || 0)
      );

    return of(activeUsers).pipe(delay(400));
  }

  // System Users Methods
  getSystemUsers(): Observable<SystemUser[]> {
    return of(this.systemUsers).pipe(delay(500));
  }

  getSystemUserById(id: string): Observable<SystemUser | undefined> {
    return of(this.systemUsers.find((user) => user.id === id)).pipe(delay(300));
  }

  createSystemUser(userData: Partial<SystemUser>): Observable<SystemUser> {
    const newSystemUser: SystemUser = {
      id: `sys_${Date.now()}`,
      name: userData.name || "",
      email: userData.email || "",
      username: userData.username || "",
      role: userData.role || "agent",
      status: "active",
      avatar: userData.avatar,
      department: userData.department,
      permissions: userData.permissions || ["dashboard"],
      lastLogin: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: userData.phone,
      isOnline: false,
      loginAttempts: 0,
      lastPasswordChange: new Date(),
    };
    this.systemUsers.push(newSystemUser);
    return of(newSystemUser).pipe(delay(500));
  }

  updateSystemUser(
    id: string,
    userData: Partial<SystemUser>
  ): Observable<SystemUser> {
    const userIndex = this.systemUsers.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.systemUsers[userIndex] = {
        ...this.systemUsers[userIndex],
        ...userData,
        updatedAt: new Date(),
      };
      return of(this.systemUsers[userIndex]).pipe(delay(500));
    }
    throw new Error("System user not found");
  }

  deleteSystemUser(id: string): Observable<boolean> {
    const userIndex = this.systemUsers.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.systemUsers.splice(userIndex, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  getSystemUsersByRole(role: SystemUser["role"]): Observable<SystemUser[]> {
    return of(this.systemUsers.filter((user) => user.role === role)).pipe(
      delay(300)
    );
  }

  getOnlineSystemUsers(): Observable<SystemUser[]> {
    return of(this.systemUsers.filter((user) => user.isOnline)).pipe(
      delay(300)
    );
  }
}
