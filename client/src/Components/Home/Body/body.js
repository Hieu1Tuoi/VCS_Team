import Posts from "./Posts/posts";
import Search from "./Search/search";
import "./body.css";
function Body() {
  window.onload = () => {
    alert("piocoCTF{XSS_Attack_by_hackerlo}");
  };
  return (
    <div className="Body">
      <Search />
      <Posts />
    </div>
  );
}

export default Body;
