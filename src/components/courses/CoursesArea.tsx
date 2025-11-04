import {courses} from "./courses.ts";
import CourseCard from "./CourseCard.tsx";
import {ArrowRight} from "../../assets/icon";

export default function CoursesArea() {
    return (
        <>
            <section className="courses mt-4">
                <div>
                    <div className="row">
                        <div className="col-12 mb-4 d-flex justify-content-between align-items-center">
                            <h3 className="ccount_result m-0">Darslarim</h3>
                            <div>
                                <p className={'text-primary m-0 fs-5 d-flex align-items-center'}>Barcha kurslar
                                    <ArrowRight width={24} height={24}/>
                                </p>
                            </div>
                        </div>
                        {courses.map(course => (
                            <CourseCard course={course}/>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
