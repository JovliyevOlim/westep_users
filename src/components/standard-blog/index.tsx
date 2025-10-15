import FooterOne from "../../layouts/footers/FooterOne";
import Breadcrumb from "../common/Breadcrumb";
import ScrollToTop from "../common/ScrollToTop";
import StandardBlogArea from "./StandardBlogArea";


 

export default function StandardBlog() {
  return (
    <>
      <Breadcrumb title="Standard Blog" subtitle="Standard Blog" />
      <StandardBlogArea />
      <FooterOne />
      <ScrollToTop />
    </>
  )
}
