import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../common/Breadcrumb";
import ScrollTop from "../common/ScrollTop";
import ScrollToTop from "../common/ScrollToTop";
import GridBlogArea from "./GridBlogArea";

 

export default function GridBlog() {
  return (
    <>
      <Breadcrumb title="Grid Blog" subtitle="Grid Blog" />
      <GridBlogArea />
      <FooterOne />
      <ScrollToTop />
      <ScrollTop />
    </>
  )
}
