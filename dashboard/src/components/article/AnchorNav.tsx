import { Anchor } from "antd";
import { useEffect, useState } from "react";
const { Link } = Anchor;

interface IHeadingAnchor {
  label: string;
  key: string;
  level: number;
  children?: IHeadingAnchor[];
}

function tocGetTreeData(
  listData: IHeadingAnchor[],
  active = ""
): IHeadingAnchor[] | undefined {
  let treeData: IHeadingAnchor[] = [];
  let tocActivePath: IHeadingAnchor[] = [];
  let treeParents = [];
  let rootNode: IHeadingAnchor = {
    key: "0",
    label: "root",
    level: 0,
    children: [],
  };
  treeData.push(rootNode);
  let lastInsNode: IHeadingAnchor = rootNode;

  let iCurrLevel = 0;
  for (let index = 0; index < listData.length; index++) {
    const element = listData[index];

    let newNode: IHeadingAnchor = {
      key: element.key,
      label: element.label,
      level: element.level,
    };

    if (newNode.level > iCurrLevel) {
      //新的层级比较大，为上一个的子目录
      treeParents.push(lastInsNode);
      if (typeof lastInsNode.children === "undefined") {
        lastInsNode.children = [];
      }
      lastInsNode.children.push(newNode);
    } else if (newNode.level === iCurrLevel) {
      //目录层级相同，为平级
      const parentNode = treeParents[treeParents.length - 1];
      if (typeof parentNode !== "undefined") {
        if (typeof parentNode.children === "undefined") {
          parentNode.children = [];
        }
        parentNode.children.push(newNode);
      }
    } else {
      // 小于 挂在上一个层级
      while (treeParents.length > 1) {
        treeParents.pop();
        if (treeParents[treeParents.length - 1].level < newNode.level) {
          break;
        }
      }
      const parentNode = treeParents[treeParents.length - 1];
      if (typeof parentNode !== "undefined") {
        if (typeof parentNode.children === "undefined") {
          parentNode.children = [];
        }
        parentNode.children.push(newNode);
      }
    }
    lastInsNode = newNode;
    iCurrLevel = newNode.level;

    if (active === element.key) {
      tocActivePath = [];
      for (let index = 1; index < treeParents.length; index++) {
        //treeParents[index]["expanded"] = true;
        tocActivePath.push(treeParents[index]);
      }
    }
  }

  return treeData[0].children;
}

interface IWidget {
  content?: string;
  open?: boolean;
}
const AnchorNavWidget = ({ open = false, content }: IWidget) => {
  const [heading, setHeading] = useState<IHeadingAnchor[]>();

  useEffect(() => {
    let heading = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
    let headingAnchor: IHeadingAnchor[] = [];
    for (let index = 0; index < heading.length; index++) {
      const element = heading[index];
      const id = heading[index].id;
      if (id) {
        console.log("level", heading[index].tagName);
        const level = parseInt(heading[index].tagName.replace("H", ""));
        headingAnchor.push({
          key: `#${id}`,
          label: element.innerHTML,
          level: level,
        });
      }
    }
    setHeading(tocGetTreeData(headingAnchor));
    console.log("heading", headingAnchor);
  }, [open]);

  const GetLink = (anchors: IHeadingAnchor[]) => {
    return anchors.map((it, id) => {
      return (
        <Link key={id} href={it.key} title={it.label}>
          {it.children ? GetLink(it.children) : undefined}
        </Link>
      );
    });
  };

  return open && heading ? (
    <Anchor offsetTop={50}>{GetLink(heading)}</Anchor>
  ) : (
    <></>
  );
};

export default AnchorNavWidget;
