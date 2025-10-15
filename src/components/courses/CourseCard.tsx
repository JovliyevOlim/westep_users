import {Link} from "react-router-dom";

function CourseCard({course}: { course: any }) {
    return (
        <>
            <div key={course.id} className="col-xl-4 col-md-6 col-12 wow fadeIn">
                <div className="single-course">
                    <div className="course-img">
                        <img src={course.image} alt="course image"/>
                        <span className="cprice">
            {course.isFree ? "Free" : course.price}
          </span>
                    </div>

                    <div className="course_content">
                        <div className="crating">
                            <a href="#">
                                {Array.from({length: course.rating}).map((_, i) => (
                                    <i key={i} className="bx bxs-star"></i>
                                ))}
                                <span>({course.reviews})</span>
                            </a>
                        </div>

                        <h2>
                            <Link to="/course-details"
                                  state={{course: course}}
                            >{course.title}</Link>
                        </h2>

                        <div className="cmeta">
                            <div className="smeta">
                                <i className='bx bx-user'></i>
                                {course.students} Students
                            </div>
                            <div className="smeta">
                                <i className='bx bx-file'></i>
                                {course.lessons} Lessons
                            </div>
                            <div className="smeta">
                                <i className='bx bx-time-five'></i>
                                {course.duration}
                            </div>
                        </div>

                        <div className="course_btm">
                            <div className="cauthor">
                                <a href="#">
                                    <img src={course.author.image} alt={course.author.name}/>
                                    <span>{course.author.name}</span>
                                </a>
                            </div>
                            <div className="ccategory">
                                <a href="#">{course.category}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseCard;