import {courses} from "./courses.ts";
import CourseCard from "./CourseCard.tsx";

export default function CoursesArea() {
    return (
        <>
            <section className="courses section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <p className="ccount_result">Showing 12 <span>Courses</span> of 16 result</p>
                        </div>
                        {courses.map(course => (
                            <CourseCard course={course}/>
                        ))}
                        <div className="col-12 text-center">
                            <div className="post_pagination">
                                <ul>
                                    <li><a href="#"><i className="fa-solid fa-arrow-left-long"></i></a></li>
                                    <li><a href="#">1</a></li>
                                    <li className="active"><a href="#">2</a></li>
                                    <li><a href="#">3</a></li>
                                    <li><a href="#"><i className="fa-solid fa-arrow-right-long"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
