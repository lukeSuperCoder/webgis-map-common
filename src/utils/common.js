import { sessionGet } from "./auth";

/**
 * 文件流下载
 * @param {文件下载地址} url
 * @param {导出的文件名} fileName
 */
export function exportFiles(url, fileName) {
  let xhr = new XMLHttpRequest();
  //请求地址
  xhr.open("get", url, true);
  xhr.responseType = "blob"; // 返回类型blob
  xhr.setRequestHeader("Authorization", sessionGet("token")); // 携带token校验
  xhr.onload = function () {
    if (this.status === 200) {
      let headerfileName = this.getResponseHeader("Content-Disposition");
      if (headerfileName && !fileName) {
        fileName = decodeURI(
          headerfileName.replace("attachment;filename=", "")
        );
      }
      let blob = this.response;
      let reader = new FileReader();
      reader.readAsDataURL(blob); // 转换为base64
      reader.onload = function (e) {
        let a = document.createElement("a"); // 创建一个a标签用于下载
        a.download = fileName.replace("t-", ""); //文件名
        a.href = e.target.result;
        document.body.append(a);
        a.click();
        a.remove();
      };
    }
  };
  xhr.send(); // 发送ajax请求
}

/**
 * 复制内容到粘贴板
 * content : 需要复制的内容
 * message : 复制完后的提示，不传则默认提示"复制成功"
 */
export function copyToClip(content, message) {
  let aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  if (message == null) {
    alert("复制成功");
  } else {
    alert(message);
  }
}

function getBlob(url, cb) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.setRequestHeader("Authorization", sessionGet("token")); // 携带token校验
  xhr.onload = function () {
    if (xhr.status === 200) {
      cb(xhr.response);
    }
  };
  xhr.send();
}

function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    let link = document.createElement("a");
    let body = document.querySelector("body");

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = "none";
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }
}
export function download(url, filename) {
  getBlob(url, function (blob) {
    saveAs(blob, filename);
  });
}

/**
 * 组装树形结构数据
 * @param data
 * @param id
 */
export function dealTreeData(data, id) {
  const idMapping = data.reduce((acc, el, i) => {
    acc[el[id]] = i;
    return acc;
  }, {});
  let root,
    roots = [];
  data.forEach((el) => {
    // 判断根节点
    if (el.parentId === "0") {
      //   if (root) {
      //     roots.push(root);
      //   }
      //   root = el;
      roots.push(el);
      return;
    }
    // 用映射表找到父元素
    const parentEl = data[idMapping[el.parentId]];
    // 把当前元素添加到父元素的`children`数组中
    parentEl.children = [...(parentEl.children || []), el];
  });
  return roots;
}
