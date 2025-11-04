import {Link} from "react-router-dom";
import courseImg from "../../assets/img/courses/7.png"
import Button from "../../ui/Button.tsx";

function CourseCard({course}: { course: any }) {
    return (
        <>
            <div key={course.id} className="col-lg-6 col-xl-4">
                <div className="single-course border border-primary">
                    <div className="course-img">
                        <img src={courseImg} alt="course image"/>
                        {/*              <span className="cprice">*/}
                        {/*  {course.isFree ? "Free" : course.price}*/}
                        {/*</span>*/}
                    </div>

                    <div className="course_content">
                        <h6 style={{
                            height: "50px"
                        }} className={'fw-bold'}>
                            <Link to="/course-details"
                                  state={{course: course}}
                            >{course.title}</Link>
                        </h6>

                        <div className="d-flex gap-3">
                            <p className={'p-0'} style={{fontSize: '10px'}}>65% o’rgandingiz </p>
                            <p className={'p-0'} style={{fontSize: '10px'}}>Oxirgi marta 2 kun oldin kirgansiz</p>
                        </div>
                        <div>
                            <Button isPending={false} type="button" height={'40px'}>
                                Davom etish
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseCard;