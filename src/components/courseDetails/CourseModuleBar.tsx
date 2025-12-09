import CourseModuleAccordionCard from "./CourseModuleAccordionCard.tsx";
import {Module} from "../../types/types.ts";

function CourseModuleBar({modules}: { modules: Module[] }) {
    return (
        <div className="
        hidden lg:block
  bg-[#F8FBFF]
  text-[#f8f9fa]
  overflow-auto
  overflow-y-scroll
  border-r

  h-dvh
  w-[400px]
  transition-[transform,width]
  duration-300
  ease-in-out
">
            <CourseModuleAccordionCard modules={modules}/>
        </div>
    );
}

export default CourseModuleBar;