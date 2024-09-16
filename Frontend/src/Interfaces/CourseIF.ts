interface SyllabusItem {
    week: number;
    topic: string;
    content: string;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    address: string;
    mobile: string;
    dob: string;
}

export interface Course {
    id: number;
    name: string;
    instructor: string;
    description?: string;
    enrollmentStatus?: string;
    thumbnail?: string;
    duration?: string;
    schedule?: string;
    location?: string;
    prerequisites?: string[];
    syllabus?: SyllabusItem[];
    students?: Student[];
    Youtubelink: string;
    courselink: string;
    stars: number;
    category:string;
}

export interface Students {
    name: string,
    email: string,
    password: string,
    address: string
}

export interface register {
    email: string,
    password: string
}

export interface whishlist{
    email: string,
    coursename: string,
    wishlist: boolean,
    course: Course
}

export interface login {
    token: string,
    id: number,
    name: string,
    address: string,
    emailId: string
}

export interface enroll{
    name: string,
    email: string,
    address: string,
    phone: string,
    course: Course,
    enrollStatus: boolean,
    courseName: string,
    dueDate?: string,
    statusChangeDate?: string,
    status?: string,
}

export interface enroll2{
    id: number,
    name: string,
    email: string,
    address: string,
    phone: string,
    course: Course,
    enrollStatus: boolean,
    courseName: string,
    dueDate?: string,
    statusChangeDate?: string,
    status?: string,
}

export interface emailValidation{
    email: string,
    courseName: string
}