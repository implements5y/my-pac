function FindProxyForURL(url, host) {
    // ====== 场景1：局域网和国内域名直连 ======
    // 排除所有局域网流量（192.168.x.x, 10.x.x.x 等）
    if (
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
        isInNet(dnsResolve(host), "172.16.0.0", "255.240.0.0") ||
        isInNet(dnsResolve(host), "192.168.0.0", "255.255.0.0") ||
        isInNet(dnsResolve(host), "127.0.0.0", "255.255.255.0")
    ) {
        return "DIRECT";
    }

    // ====== 场景2：匹配国内常见域名（直连）===== //
    const cnDomains = [
        "*.baidu.com", "*.taobao.com", "*.jd.com", "*.qq.com", 
        "*.weibo.com", "*.zhihu.com", "*.bilibili.com", "*.163.com",
        "*.gov.cn", "*.edu.cn", "*.cn", "*.alicdn.com", "*.tencent.com",
        "*.weixin.qq.com", "*.douyin.com", "*.tmall.com"
    ];
    for (let domain of cnDomains) {
        if (shExpMatch(host, domain)) return "DIRECT";
    }

    // ====== 场景3：匹配国外域名（走代理）===== //
    const foreignKeywords = [
        "youtube", "google", "twitter", "facebook", "instagram",
        "netflix", "amazon", "tiktok", "reddit", "whatsapp",
        "gmail", "openai.com", "discord", "telegram", "github",
        "imdb"
    ];
    for (let keyword of foreignKeywords) {
        if (shExpMatch(url, "*" + keyword + "*")) {
            return "PROXY 192.168.43.163:8080"; // 使用你的代理IP和端口
        }
    }

    // ====== 场景4：其他网站智能判断 ====== //
    // 非国内域名且包含 .com/.org/.io 等走代理
    const globalTlds = [".com", ".org", ".net", ".io", ".ai", ".app"];
    for (let tld of globalTlds) {
        if (host.endsWith(tld) && !host.endsWith(".cn")) {
            return "PROXY 192.168.43.163:8080";
        }
    }

    // 默认直连（避免误拦截）
    return "DIRECT";
}