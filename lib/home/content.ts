import type { HomeContent } from "@/lib/home/types";

export const fallbackHomeContent: HomeContent = {
  hero: {
    title: "Chinh phuc hoc bong Trung Quoc cung Mentor ChinaHack",
    subtitle: "Lo trinh ca nhan hoa, tu ho so den phong van.",
    ctaText: "Nhan tu van mien phi",
    ctaHref: "#lead-form",
    mentorImage: {
      src: "/images/mentor-hero.webp",
      alt: "Mentor ChinaHack",
      width: 640,
      height: 860,
    },
  },
  about: {
    heading: "Ve chung toi",
    body: "ChinaHack ho tro hoc vien toi uu ho so va chien luoc hoc bong.",
    highlightQuote: "Dung lo trinh dung, co hoi hoc bong mo rong hon.",
  },
  whyChoose: [
    {
      id: "w1",
      title: "Mentor thuc chien",
      description: "Kinh nghiem tu ho so that",
      icon: "book",
    },
    {
      id: "w2",
      title: "Lo trinh ro rang",
      description: "Bam sat moc thoi gian",
      icon: "target",
    },
    {
      id: "w3",
      title: "Tai nguyen chat luong",
      description: "Mau bai va checklist",
      icon: "medal",
    },
    {
      id: "w4",
      title: "Cong dong ho tro",
      description: "Dong hanh xuyen suot",
      icon: "network",
    },
  ],
  mentors: [
    {
      id: "m1",
      name: "Mentor A",
      role: "Scholarship Mentor",
      avatar: "/images/mentor-a.webp",
      shortBio: "Phu trach ho so va hoc bong.",
      fullBio: "Ho tro chuyen sau ve chien luoc ho so, essay va interview.",
    },
    {
      id: "m2",
      name: "Mentor B",
      role: "Application Strategist",
      avatar: "/images/mentor-b.webp",
      shortBio: "Toi uu lo trinh nop ho so.",
      fullBio:
        "Tap trung vao mot lo trinh ca nhan hoa va moc thoi gian ro rang.",
    },
    {
      id: "m3",
      name: "Mentor C",
      role: "Interview Coach",
      avatar: "/images/mentor-c.webp",
      shortBio: "Luyen phong van va story telling.",
      fullBio:
        "Luyen interview va phan hoi cau hoi kho de tang ty le chot hoc bong.",
    },
  ],
  stats: [
    { id: "s1", label: "Hoc vien", value: 120, suffix: "+" },
    { id: "s2", label: "Hoc bong", value: 85, suffix: "%" },
    { id: "s3", label: "Doi tac", value: 30, suffix: "+" },
    { id: "s4", label: "Nam kinh nghiem", value: 6, suffix: "+" },
  ],
  process: [
    {
      id: "p1",
      title: "Nhan ho so",
      description: "Thu thap thong tin dau vao va muc tieu.",
    },
    {
      id: "p2",
      title: "Danh gia",
      description: "Phan tich profile, GPA va muc hoc bong.",
    },
    {
      id: "p3",
      title: "Lap lo trinh",
      description: "Xay dung cac moc han va phan cong hang muc.",
    },
    {
      id: "p4",
      title: "Hoan thien ho so",
      description: "Essay, CV, recommendation va phan hoi.",
    },
    {
      id: "p5",
      title: "Nop don",
      description: "Canh moc submit va theo doi ket qua.",
    },
    {
      id: "p6",
      title: "Phong van",
      description: "Luyen tap va support truoc buoi interview.",
    },
  ],
  services: [
    {
      id: "sv1",
      name: "Basic",
      description: "Danh gia ho so co ban.",
      features: ["Phan tich profile", "Goi y hoc bong", "1 buoi tu van"],
      ctaText: "Chon Basic",
      ctaHref: "#lead-form",
    },
    {
      id: "sv2",
      name: "Standard",
      description: "Lo trinh chinh sua ho so.",
      features: ["Essay review", "Checklist nop don", "2 buoi coaching"],
      ctaText: "Chon Standard",
      ctaHref: "#lead-form",
      isFeatured: true,
    },
    {
      id: "sv3",
      name: "Premium",
      description: "Dong hanh den khi co ket qua.",
      features: ["1-1 mentor", "Phong van thu", "Theo doi sau nop"],
      ctaText: "Chon Premium",
      ctaHref: "#lead-form",
    },
  ],
  universities: [
    { id: "u1", name: "Tsinghua", logo: "/images/university-1.webp" },
    {
      id: "u2",
      name: "Peking University",
      logo: "/images/university-2.webp",
    },
    { id: "u3", name: "Fudan", logo: "/images/university-3.webp" },
    { id: "u4", name: "SJTU", logo: "/images/university-4.webp" },
  ],
  successStories: [
    {
      id: "ss1",
      studentName: "Minh Anh",
      quote: "Ho so duoc toi uu ro ret va de hieu hon.",
      outcome: "Nhan hoc bong 80%",
      avatar: "/images/student-1.webp",
    },
    {
      id: "ss2",
      studentName: "Quang Huy",
      quote: "Phong van giam cam giac lo lang rat nhieu.",
      outcome: "Trung tuyen chuong trinh thac si",
      avatar: "/images/student-2.webp",
    },
  ],
  blogTabs: [
    { id: "all", label: "Tat ca", slug: "all" },
    { id: "scholarship", label: "Hoc bong", slug: "hoc-bong" },
    { id: "guide", label: "Huong dan", slug: "huong-dan" },
  ],
  community: [
    {
      id: "c1",
      name: "Facebook",
      description: "Cap nhat san hoc bong va chia se kinh nghiem.",
      href: "https://facebook.com",
      bannerImage: "/images/community-facebook.webp",
    },
    {
      id: "c2",
      name: "TikTok",
      description: "Video ngan ve quy trinh va tips nhanh.",
      href: "https://tiktok.com",
      bannerImage: "/images/community-tiktok.webp",
    },
    {
      id: "c3",
      name: "YouTube",
      description: "Huong dan chi tiet va webinar.",
      href: "https://youtube.com",
      bannerImage: "/images/community-youtube.webp",
    },
  ],
  leadForm: {
    title: "Dang ky danh gia ho so",
    subtitle: "Nhan lo trinh ca nhan hoa trong 24h",
    submitText: "Nhan danh gia ho so mien phi",
    loadingText: "Dang xu ly...",
  },
};
