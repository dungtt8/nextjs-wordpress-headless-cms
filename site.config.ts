type LocaleSeo = {
  title: string;
  description: string;
};

type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  seo: Record<"en" | "vi" | "zh", LocaleSeo>;
};

export const siteConfig: SiteConfig = {
  site_name: "ChinaHack",
  site_description: "Mentorship và quy trình ứng tuyển học bổng cho học sinh, sinh viên định hướng du học Trung Quốc.",
  site_domain: "https://chinahack.revonexus.net",
  seo: {
    vi: {
      title: "ChinaHack | Mentorship & Lộ trình học bổng du học Trung Quốc",
      description:
        "Mentorship và quy trình ứng tuyển học bổng cho học sinh, sinh viên định hướng du học Trung Quốc.",
    },
    en: {
      title: "ChinaHack | Mentorship & Scholarship Application",
      description:
        "Mentorship and application guidance for students pursuing scholarships to study in China.",
    },
    zh: {
      title: "ChinaHack | 留学中国奖学金申请辅导",
      description: "为计划赴华留学的学生提供奖学金申请指导与全程陪伴。",
    },
  },
};
