function FindProxyForURL(url, host) {
    // ====== 场景1：局域网直连 ======
    if (
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
        isInNet(dnsResolve(host), "172.16.0.0", "255.240.0.0") ||
        isInNet(dnsResolve(host), "192.168.0.0", "255.255.0.0") ||
        isInNet(dnsResolve(host), "127.0.0.0", "255.255.255.0")
    ) {
        return "DIRECT";
    }

    // ====== 场景2：国内域名直连（精确匹配）===== //
    const cnDomains = [
        // 搜索引擎
        "*baidu*", "*sogou*", "*so.com*", "*sm.cn*", 
        // 电商购物
        "*taobao*", "*tmall*", "*jd*", "*pinduoduo*", "*suning*", "*dangdang*", "*vip.com*",
        // 社交媒体
        "*weibo*", "*zhihu*", "*douban*", "*xiaohongshu*", "*tieba*", "*tianya*",
        // 视频音乐
        "*bilibili*", "*iqiyi*", "*youku*", "*tudou*", "*mgtv*", "*qq.com*", "*kuwo*", "*kugou*", "*netase*", "*douyin*", "*163*", "*kuaishou*",
        // 生活服务
        "*dianping*", "*meituan*", "*ele.me*", "*ctrip*", "*qunar*", "*12306*",
        // 新闻资讯
        "*people*", "*xinhua*", "*ifeng*", "*sina*", "*sohu*", "*163.com*", "*china.com*",
        // 政府教育
        "*.gov.cn", "*.edu.cn", "*.org.cn", "*.ac.cn", "*xuexi.cn*",
        // 金融支付
        "*alipay*", "*unionpay*", "*cmbchina*", "*icbc*", "*abc*", "*boc*", "*ccb*",
        // 其他常用
        "*weather*", "*mi*", "*huawei*", "*oppo*", "*vivo*", "*xiaomi*", "*tencent*", "*.cn*", "*alicdn*", "*tencent*", "*apple*"
    ];
    
    // ✅ 移除 .cn 强制直连规则（避免误判）
    for (let domain of cnDomains) {
        if (shExpMatch(host, domain)) return "DIRECT";
    }

    // ====== 场景3：国外域名代理 ====== //
    const foreignDomains = [
        // 国际巨头
        "*google*", "*youtube*", "*gstatic*", "*googleapis*", 
        "*facebook*", "*fbcdn*", "*instagram*", "*whatsapp*", 
        "*twitter*", "*twimg*", "*x.com*", "*t.co*",
        "*microsoft*", "*live*", "*office*", "*windows*",
        "*amazon*", "*aws*", "*cloudfront*",
        "*apple*", "*icloud*", "*x*",
        
        // 流媒体
        "*netflix*", "*nflx*", 
        "*disney*", "*disneyplus*", 
        "*hbo*", "*hbomax*", 
        "*spotify*", "*pandora*",
        "*twitch*",
        
        // 社交平台
        "*reddit*", "*tumblr*", "*pinterest*", "*linkedin*", "*tiktok*", "*discord*", "*telegram*",
        
        // 技术开发
        "*github*", "*gitlab*", "*stackoverflow*", "*npmjs*", "*docker*", "*kubernetes*", 
        "*medium*", "*git*", "*atlassian*", "*jira*", "*slack*", "*trello*", 
        
        // 新闻资讯
        "*bbc*", "*cnn*", "*nytimes*", "*wsj*", "*bloomberg*", "*reuters*", "*apnews*",
        
        // 其他常用
        "*wikipedia*", "*wikimedia*", "*quora*", "*yahoo*", "*ebay*", "*paypal*", "*wordpress*", "*imdb*"
    ];
    
    for (let domain of foreignDomains) {
        if (shExpMatch(host, domain)) {  // ✅ 修正：只匹配host而非url
            return "PROXY 192.168.42.129:8080";
        }
    }

    

    // ====== 场景4：智能后备规则 ====== //
    const globalTlds = [".com", ".org", ".net", ".io", ".ai", ".app", ".dev", ".xyz"];
    for (let tld of globalTlds) {
        // ✅ 优化：排除中国专属TLD
        if (host.endsWith(tld) && !host.endsWith(".cn")) {
            return "PROXY 192.168.42.129:8080";
        }
    }

    // 默认直连
    return "DIRECT";
}