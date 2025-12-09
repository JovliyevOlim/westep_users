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
}

export interface Course extends Common {
    name: string,
    description: string,
    isPublished: boolean,
    publishedAt: string,
    businessId: string
    attachmentId: string | null
}

export interface StudentCourse extends Common {
    courseId: string,
    courseName: string,
    studentId: boolean,
    attachmentId: string,
    percent: number,
}

export interface Module extends Common {
    name: string,
    description?: string,
    courseId: string
    orderIndex: number | null,
    active?: boolean,
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