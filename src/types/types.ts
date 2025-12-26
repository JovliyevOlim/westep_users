export interface Common {
    id: string;
    createdAt?: string
}


export interface User {
    firstname: string,
    lastname: string,
    birthDate: string,
    gender: string,
    password: string,
    phone: string
    phoneNumber: string
}

export interface Course extends Common {
    name: string,
    description: string,
    isPublished: boolean,
    publishedAt: string,
    businessId: string
    attachmentUrl: string | null
    price: number
}

export interface StudentCourse extends Common {
    courseId: string,
    courseName: string,
    studentId: boolean,
    attachmentUrl: string,
    percent: number,
}

export interface Module extends Common {
    name: string,
    description?: string,
    courseId: string
    orderIndex: number | null,
    active?: boolean,
    price: number,
}

export interface Lesson extends Common {
    name: string,
    description?: string,
    moduleId: string,
    orderIndex: number | null,
    estimatedDuration: number | null,
    videoUrl?: string,
    active?: boolean,
    done?: boolean,
}