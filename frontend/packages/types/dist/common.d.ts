export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: PaginationInfo;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface SearchParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
}
export interface FileUpload {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: Date;
    uploadedBy: string;
}
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    readAt?: Date;
}
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
}
export interface TimeRange {
    start: Date;
    end: Date;
}
export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
    required?: boolean;
    placeholder?: string;
    options?: SelectOption[];
    validation?: ValidationRule[];
}
export interface ValidationRule {
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    value?: any;
    message: string;
}
export interface ErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
    details?: Record<string, any>;
}
export interface SuccessResponse<T = any> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}
//# sourceMappingURL=common.d.ts.map