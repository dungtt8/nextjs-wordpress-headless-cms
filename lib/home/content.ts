import type { HomeContent } from "@/lib/home/types";

export const fallbackHomeContent: HomeContent = {
    hero: {
        title: "Chinh phục học bổng Trung Quốc cùng Mentor ChinaHack",
        subtitle: "Lộ trình cá nhân hóa, từ hồ sơ đến phỏng vấn.",
        ctaText: "Nhận tư vấn miễn phí",
        ctaHref: "#lead-form",
        mentorImage: {
            src: "/images/mentor-hero.webp",
            alt: "Mentor ChinaHack",
            width: 640,
            height: 860,
        },
    },
    about: {
        heading: "Về chúng tôi",
        body: "ChinaHack hỗ trợ học viên tối ưu hồ sơ và chiến lược học bổng.",
        highlightQuote: "Đúng lộ trình đúng, cơ hội học bổng mở rộng hơn.",
        image: {
            src: "/logo.svg",
            alt: "ChinaHack visual",
        },
    },
    whyChoose: [
        {
            id: "w1",
            title: { en: "Hands-on Mentors", vi: "Mentor thực chiến", zh: "实战导师" },
            description: { en: "Experience from real profiles", vi: "Kinh nghiệm từ hồ sơ thật", zh: "来自真实档案的经验" },
            icon: "book",
        },
        {
            id: "w2",
            title: { en: "Clear Roadmap", vi: "Lộ trình rõ ràng", zh: "清晰的路线图" },
            description: { en: "Stays on schedule", vi: "Bám sát mốc thời gian", zh: "紧跟时间节点" },
            icon: "target",
        },
        {
            id: "w3",
            title: { en: "Quality Resources", vi: "Tài nguyên chất lượng", zh: "优质资源" },
            description: { en: "Templates and checklists", vi: "Mẫu bài và checklist", zh: "模板和清单" },
            icon: "medal",
        },
        {
            id: "w4",
            title: { en: "Supportive Community", vi: "Cộng đồng hỗ trợ", zh: "支持性社区" },
            description: { en: "Ongoing companionship", vi: "Đồng hành xuyên suốt", zh: "全程陪伴" },
            icon: "network",
        },
    ],
    mentors: [
        {
            id: "m1",
            name: { en: "Li Jiapeng", vi: "Li Jiapeng", zh: "李嘉鹏" },
            role: { en: "Academic Advisor", vi: "Cố vấn học thuật", zh: "学术顾问" },
            avatar: "/images/mentor-a.webp",
            headline: { en: "AI, Robotics and Research Direction in China", vi: "AI, Robotics và định hướng nghiên cứu tại Trung Quốc", zh: "人工智能、机器人和中国研究方向" },
            shortBio: { en: "Supporting mentees in engineering, AI and research scholarships.", vi: "Đồng hành cùng mentee ở nhóm ngành kỹ thuật, AI và học bổng nghiên cứu.", zh: "支持工程、AI和研究奖学金领域的学生。" },
            fullBio: { en: "In-depth support from academic guidance, building research profiles to scholarship application strategy for engineering students in China.", vi: "Hỗ trợ chuyên sâu từ định hướng học thuật, xây hồ sơ nghiên cứu đến chiến lược xin học bổng cho các bạn theo đuổi nhóm ngành kỹ thuật tại Trung Quốc.", zh: "为在中国攻读工程专业的学生提供从学术指导、建立研究档案到奖学金申请策略的深入支持。" },
            focusAreas: [
                { en: "Academic Guidance", vi: "Định hướng học thuật", zh: "学术指导" },
                { en: "Research Profile", vi: "Hồ sơ nghiên cứu", zh: "研究档案" },
                { en: "Engineering Scholarship", vi: "Học bổng kỹ thuật", zh: "工程奖学金" },
            ],
            achievements: [
                { en: "Pursued AI and Computer Vision research in international environment.", vi: "Theo đuổi hướng nghiên cứu AI và Computer Vision trong môi trường quốc tế.", zh: "在国际环境中从事AI和计算机视觉研究。" },
                { en: "Experience with Robotics, computer vision models and intelligent systems.", vi: "Có kinh nghiệm với Robotics, mô hình thị giác máy tính và hệ thống thông minh.", zh: "具有机器人、计算机视觉模型和智能系统的经验。" },
                { en: "Led academic projects with research-oriented applications.", vi: "Từng tham gia và dẫn dắt các dự án học thuật theo định hướng ứng dụng.", zh: "主导过面向应用的学术项目。" },
                { en: "Perfect for profiles needing academic depth and research thinking.", vi: "Phù hợp mentoring cho các hồ sơ cần chiều sâu học thuật và tư duy nghiên cứu.", zh: "适合需要学术深度和研究思维的档案。" },
            ],
            quote: { en: "A strong profile doesn't just need scores, but a clear academic direction and research potential.", vi: "Một hồ sơ mạnh không chỉ cần điểm số, mà cần kể rõ định hướng học thuật và tiềm năng nghiên cứu của bạn.", zh: "一份强有力的档案不仅需要成绩，还需要清晰的学术方向和研究潜力。" },
        },
        {
            id: "m2",
            name: { en: "Le Thi Phuong Anh", vi: "Lê Thị Phương Anh", zh: "黎氏芳英" },
            role: { en: "ChinaHack - Marketing Manager", vi: "ChinaHack - Marketing Manager", zh: "ChinaHack - 市场经理" },
            avatar: "/images/mentor-b.webp",
            headline: { en: "Academic Model through Extracurriculars and Scholarships", vi: "Hình mẫu học thuật qua hoạt động ngoại khóa và học bổng", zh: "通过课外活动和奖学金的学术模式" },
            shortBio: { en: "Profile positioning balance between academics and personal activities.", vi: "Phụ trách định vị hồ sơ nổi bật, cân bằng giữa học thuật và hoạt động cá nhân.", zh: "档案定位突出，平衡学术和个人活动。" },
            fullBio: { en: "Focus on building clear profile story, consistent and help mentees showcase personal identity, academic ability and depth of activities.", vi: "Tập trung xây dựng câu chuyện hồ sơ rõ ràng, nhất quán, giúp mentee thể hiện được bản sắc cá nhân, năng lực học thuật và chiều sâu hoạt động ngoại khóa.", zh: "专注于建立清晰一致的档案故事，帮助学生展示个人身份、学术能力和活动深度。" },
            focusAreas: [
                { en: "Build Personal Story", vi: "Xây dựng personal story", zh: "建立个人故事" },
                { en: "Extracurricular Activities", vi: "Hoạt động ngoại khóa", zh: "课外活动" },
                { en: "Scholarship Positioning", vi: "Scholarship positioning", zh: "奖学金定位" },
            ],
            achievements: [
                { en: "IELTS 8.0 and strong academic foundation for international profiles.", vi: "IELTS 8.0 và nền tảng học thuật mạnh cho hồ sơ quốc tế.", zh: "雅思8.0和国际档案的强大学术基础。" },
                { en: "Experience highlighting profiles through personal communication and community activities.", vi: "Kinh nghiệm làm nổi bật hồ sơ qua truyền thông cá nhân và hoạt động cộng đồng.", zh: "通过个人沟通和社区活动突出档案的经验。" },
                { en: "Help mentees tell compelling and in-depth profile stories.", vi: "Đồng hành cùng mentee trong cách kể câu chuyện hồ sơ thuyết phục và có chiều sâu.", zh: "帮助学生讲述有说服力和深度的档案故事。" },
                { en: "Perfect for profiles needing higher visibility beyond pure scores.", vi: "Phù hợp với các hồ sơ cần tăng độ nổi bật ngoài điểm số thuần túy.", zh: "适合需要超越纯分数获得更高知名度的档案。" },
            ],
            quote: { en: "Real strength doesn't lie in having many achievements, but in connecting them into a purposeful story.", vi: "Điểm mạnh thật sự của hồ sơ không nằm ở việc có thật nhiều thành tích, mà ở cách bạn kết nối chúng thành một câu chuyện có định hướng.", zh: "真正的优势不在于拥有许多成就，而在于将它们连接成一个有目的的故事。" },
        },
        {
            id: "m3",
            name: { en: "ChinaHack Mentor Team", vi: "ChinaHack Mentor Team", zh: "ChinaHack导师团队" },
            role: { en: "Mentorship & Scholarship Application", vi: "Mentorship & Scholarship Application", zh: "指导和奖学金申请" },
            avatar: "/images/mentor-c.webp",
            headline: { en: "Academic Guidance, Profile Building and Scholarship Application", vi: "Định hướng học thuật, xây dựng hồ sơ và nộp học bổng", zh: "学术指导、档案建设和奖学金申请" },
            shortBio: { en: "Mentor team accompanying from initial guidance to final interview.", vi: "Mentor team đồng hành xuyên suốt từ định hướng ban đầu đến vòng phỏng vấn cuối.", zh: "导师团队从初始指导到最终面试全程陪伴。" },
            fullBio: { en: "Coordinated mentoring at each stage: major selection, university choice, scholarship optimization, profile writing and interview preparation for clear and proactive journey.", vi: "Đội ngũ mentor phối hợp theo từng giai đoạn: định hướng ngành học, chọn trường, tối ưu học bổng, viết hồ sơ và luyện phỏng vấn để mentee có một hành trình rõ ràng và chủ động.", zh: "协调的指导覆盖每个阶段：专业选择、大学选择、奖学金优化、档案编写和面试准备，为学生提供明确和主动的旅程。" },
            focusAreas: [
                { en: "Choose Right University", vi: "Chọn trường phù hợp", zh: "选择合适的大学" },
                { en: "Optimize Scholarship", vi: "Tối ưu học bổng", zh: "优化奖学金" },
                { en: "Interview Preparation", vi: "Luyện phỏng vấn", zh: "面试准备" },
            ],
            achievements: [
                { en: "Mentoring through each stage, not just isolated profile editing.", vi: "Mentoring theo mô hình đồng hành từng giai đoạn, không chỉ sửa hồ sơ đơn lẻ.", zh: "通过每个阶段的指导，而不仅仅是孤立的档案编辑。" },
                { en: "Focus on fit between ability, goals and scholarship strategy.", vi: "Tập trung vào sự phù hợp giữa năng lực, mục tiêu và chiến lược học bổng.", zh: "专注于能力、目标和奖学金策略之间的契合度。" },
                { en: "Priority on quick feedback, clear checklists and personalized roadmaps for each mentee.", vi: "Ưu tiên phản hồi nhanh, checklist rõ ràng và lộ trình cá nhân hóa cho từng mentee.", zh: "优先提供快速反馈、清晰的检查清单和个性化的学生路线图。" },
                { en: "Perfect for students needing a close companion from start to end.", vi: "Phù hợp với học sinh cần một người đồng hành sát sao từ đầu đến cuối.", zh: "适合需要从头到尾密切陪伴的学生。" },
            ],
            quote: { en: "ChinaHack's goal isn't just to help you submit, but to help you understand why it can reach scholarship.", vi: "Mục tiêu của ChinaHack không phải chỉ giúp bạn nộp hồ sơ, mà là giúp bạn hiểu vì sao hồ sơ đó có thể chạm tới học bổng.", zh: "ChinaHack的目标不仅仅是帮助您提交，而是帮助您理解为什么它能获得奖学金。" },
        },
    ],
    stats: [
        { id: "s1", label: { en: "Students", vi: "Học viên", zh: "学生" }, value: 120, suffix: "+" },
        { id: "s2", label: { en: "Scholarship Rate", vi: "Học bổng", zh: "奖学金率" }, value: 85, suffix: "%" },
        { id: "s3", label: { en: "Partners", vi: "Đối tác", zh: "合作伙伴" }, value: 30, suffix: "+" },
        { id: "s4", label: { en: "Years of Experience", vi: "Năm kinh nghiệm", zh: "年经验" }, value: 6, suffix: "+" },
    ],
    process: [
        {
            id: "p1",
            title: { en: "Intake", vi: "Nhận hồ sơ", zh: "接收资料" },
            description: { en: "Collect input information and goals.", vi: "Thu thập thông tin đầu vào và mục tiêu.", zh: "收集输入信息和目标。" },
        },
        {
            id: "p2",
            title: { en: "Assessment", vi: "Đánh giá", zh: "评估" },
            description: { en: "Analyze profile, GPA and scholarship level.", vi: "Phân tích profile, GPA và mức học bổng.", zh: "分析档案、GPA和奖学金水平。" },
        },
        {
            id: "p3",
            title: { en: "Roadmap Planning", vi: "Lập lộ trình", zh: "制定路线图" },
            description: { en: "Build deadlines and assign categories.", vi: "Xây dựng các mốc hạn và phân công hạng mục.", zh: "建立截止日期并分配类别。" },
        },
        {
            id: "p4",
            title: { en: "Profile Completion", vi: "Hoàn thiện hồ sơ", zh: "完善档案" },
            description: { en: "Essay, CV, recommendation and feedback.", vi: "Essay, CV, recommendation và phản hồi.", zh: "文书、简历、推荐信和反馈。" },
        },
        {
            id: "p5",
            title: { en: "Submission", vi: "Nộp đơn", zh: "提交申请" },
            description: { en: "Track submission deadlines and follow up on results.", vi: "Canh mốc submit và theo dõi kết quả.", zh: "把握提交时间并跟踪结果。" },
        },
        {
            id: "p6",
            title: { en: "Interview", vi: "Phỏng vấn", zh: "面试" },
            description: { en: "Practice and support before the interview.", vi: "Luyện tập và support trước buổi interview.", zh: "面试前的练习和支持。" },
        },
    ],
    services: [
        {
            id: "sv1",
            packageLabel: { en: "Package 1", vi: "Gói 1", zh: "套餐 1" },
            name: { en: "Basic Package", vi: "Gói cơ bản", zh: "基础套餐" },
            priceValue: 10000000,
            currency: "VND",
            sections: [
                {
                    icon: "profile",
                    title: { en: "Roadmap Direction", vi: "Định hướng lộ trình", zh: "路线规划指导" },
                    items: [
                        { en: "Ability analysis, suitable major and a shortlist of 3-5 priority universities.", vi: "Phân tích năng lực, định hướng ngành học và gợi ý top 3-5 trường ưu tiên.", zh: "分析能力，指导选择专业，并推荐 3-5 所优先院校。" },
                    ],
                },
                {
                    icon: "optimize",
                    title: { en: "Profile Optimization", vi: "Tối ưu hóa hồ sơ", zh: "档案优化" },
                    items: [
                        { en: "Study Plan: up to 2 edit rounds.", vi: "Study Plan: tối đa 2 lần chỉnh sửa.", zh: "学习计划：最多 2 次修改。" },
                        { en: "CV: up to 2 edit rounds.", vi: "CV: tối đa 2 lần chỉnh sửa.", zh: "简历：最多 2 次修改。" },
                        { en: "Recommendation letters: 2 letters, 1 edit round.", vi: "Thư giới thiệu: 2 thư, chỉnh sửa 1 lần.", zh: "推荐信：2 份，修改 1 次。" },
                    ],
                },
            ],
            refundPolicy: { type: "none", items: [] },
            ctaText: { en: "Choose Basic", vi: "Chọn gói cơ bản", zh: "选择基础套餐" },
            ctaHref: "#lead-form",
        },
        {
            id: "sv2",
            packageLabel: { en: "Package 2", vi: "Gói 2", zh: "套餐 2" },
            name: { en: "University-funded Scholarship Package", vi: "Gói học bổng trường tính", zh: "校内奖学金套餐" },
            priceValue: 25000000,
            currency: "VND",
            sections: [
                {
                    icon: "profile",
                    title: { en: "Profile Building & Refinement", vi: "Xây dựng & hoàn thiện hồ sơ", zh: "档案建设与完善" },
                    items: [
                        { en: "Profile strategy for up to 2 majors.", vi: "Chiến lược xây dựng profile cho tối đa 2 ngành học.", zh: "为最多 2 个专业制定档案策略。" },
                        { en: "CV, personal statement, recommendation letters and other required documents.", vi: "Hoàn thiện CV, bài luận cá nhân, thư giới thiệu và các tài liệu cần thiết.", zh: "完善简历、个人陈述、推荐信及其他所需材料。" },
                        { en: "Research proposal and pre-acceptance letter request (Master's/PhD).", vi: "Xây dựng đề cương nghiên cứu, xin pre-acceptance letter (Thạc sĩ/Tiến sĩ).", zh: "撰写研究计划书，申请预录取信（硕士/博士）。" },
                    ],
                },
                {
                    icon: "apply",
                    title: { en: "University Selection & Submission", vi: "Chọn trường & nộp hồ sơ", zh: "择校与提交申请" },
                    items: [
                        { en: "Shortlist of 6 suitable universities, full submission support.", vi: "Tư vấn 6 trường phù hợp và hỗ trợ nộp hồ sơ trọn gói.", zh: "提供 6 所合适院校建议，全程协助提交申请。" },
                    ],
                },
                {
                    icon: "interview",
                    title: { en: "Mock Interview", vi: "Luyện phỏng vấn", zh: "面试训练" },
                    items: [
                        { en: "2 mock interview sessions, flexible scheduling.", vi: "2 buổi mock interview, thời gian linh hoạt.", zh: "2 次模拟面试，时间灵活安排。" },
                    ],
                },
                {
                    icon: "support",
                    title: { en: "Ongoing Support & Issue Handling", vi: "Đồng hành & xử lý sự cố", zh: "全程陪伴与问题处理" },
                    items: [
                        { en: "Liaises with universities and handles issues on your behalf.", vi: "Thay mặt liên hệ nhà trường và xử lý sự cố phát sinh.", zh: "代表学生联系院校，处理突发问题。" },
                    ],
                },
            ],
            note: {
                en: "Also covers extra applications to CSC (Government) and Confucius Institute scholarships, but the refund policy below does not apply if either is awarded.",
                vi: "Có hỗ trợ nộp thêm học bổng CSC (Chính phủ) và CIS (Khổng Tử), nhưng không áp dụng chính sách hoàn phí bên dưới nếu trúng hai loại học bổng này.",
                zh: "支持额外申请 CSC（政府）及孔子学院奖学金，但若获得这两类奖学金，以下退费政策不适用。",
            },
            refundPolicy: {
                type: "conditional",
                items: [
                    { en: "No scholarship awarded: refund of 5,000,000 VND.", vi: "Không đỗ học bổng nào: hoàn lại 5.000.000 VND.", zh: "未获得任何奖学金：退还 5,000,000 VND。" },
                ],
            },
            ctaText: { en: "Choose Standard", vi: "Chọn gói học bổng trường tính", zh: "选择校内奖学金套餐" },
            ctaHref: "#lead-form",
            isFeatured: true,
        },
        {
            id: "sv3",
            packageLabel: { en: "Package 3", vi: "Gói 3", zh: "套餐 3" },
            name: { en: "Full Scholarship Package", vi: "Gói học bổng toàn phần", zh: "全额奖学金套餐" },
            priceValue: 36000000,
            currency: "VND",
            sections: [
                {
                    icon: "profile",
                    title: { en: "Profile Building & Refinement", vi: "Xây dựng & hoàn thiện hồ sơ", zh: "档案建设与完善" },
                    items: [
                        { en: "Profile strategy for up to 2 majors.", vi: "Chiến lược xây dựng profile cho tối đa 2 ngành học.", zh: "为最多 2 个专业制定档案策略。" },
                        { en: "CV, personal statement, recommendation letters and other required documents.", vi: "Hoàn thiện CV, bài luận cá nhân, thư giới thiệu và các tài liệu cần thiết.", zh: "完善简历、个人陈述、推荐信及其他所需材料。" },
                        { en: "Research proposal and pre-acceptance letter request (Master's/PhD).", vi: "Xây dựng đề cương nghiên cứu, xin pre-acceptance letter (Thạc sĩ/Tiến sĩ).", zh: "撰写研究计划书，申请预录取信（硕士/博士）。" },
                    ],
                },
                {
                    icon: "apply",
                    title: { en: "University Selection & Submission", vi: "Chọn trường & nộp hồ sơ", zh: "择校与提交申请" },
                    items: [
                        { en: "No limit on universities, full support from account setup to submission.", vi: "Không giới hạn số trường, hỗ trợ trọn gói từ tạo tài khoản đến nộp hồ sơ.", zh: "不限申请院校数量，从建账户到提交全程协助。" },
                    ],
                },
                {
                    icon: "interview",
                    title: { en: "Advanced Mock Interview", vi: "Luyện phỏng vấn chuyên sâu", zh: "深度面试训练" },
                    items: [
                        { en: "3 in-depth mock interview sessions, flexible scheduling.", vi: "3 buổi mock interview chuyên sâu, thời gian linh hoạt.", zh: "3 次深度模拟面试，时间灵活安排。" },
                    ],
                },
                {
                    icon: "support",
                    title: { en: "Ongoing Support & Issue Handling", vi: "Đồng hành & xử lý sự cố", zh: "全程陪伴与问题处理" },
                    items: [
                        { en: "Liaises with universities and resolves issues as fast as possible.", vi: "Thay mặt liên hệ nhà trường, xử lý sự cố nhanh nhất.", zh: "代表学生联系院校，最快处理突发情况。" },
                    ],
                },
            ],
            refundPolicy: {
                type: "conditional",
                items: [
                    { en: "University scholarship awarded but CSC not awarded: refund of 15,000,000 VND.", vi: "Đỗ học bổng trường nhưng trượt CSC: hoàn lại 15.000.000 VND.", zh: "获得校内奖学金但未获 CSC：退还 15,000,000 VND。" },
                    { en: "No scholarship awarded (applies when applying to 2+ universities): refund of 25,000,000 VND.", vi: "Không đỗ học bổng nào (nộp từ 2 trường trở lên): hoàn lại 25.000.000 VND.", zh: "未获得任何奖学金（须申请 2 所以上院校）：退还 25,000,000 VND。" },
                ],
            },
            ctaText: { en: "Choose Premium", vi: "Chọn gói học bổng toàn phần", zh: "选择全额奖学金套餐" },
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
            avatar: "/images/student-1.webp",
            quote: {
                en: "Profile was clearly optimized and easier to understand.",
                vi: "Hồ sơ được tối ưu rõ rệt và dễ hiểu hơn.",
                zh: "档案得到了明显优化，更易理解。",
            },
            outcome: {
                en: "Received 80% scholarship",
                vi: "Nhận học bổng 80%",
                zh: "获得80%奖学金",
            },
        },
        {
            id: "ss2",
            studentName: "Quang Huy",
            avatar: "/images/student-2.webp",
            quote: {
                en: "Interview preparation greatly reduced anxiety.",
                vi: "Phỏng vấn giảm cảm giác lo lắng rất nhiều.",
                zh: "面试准备大大减轻了焦虑。",
            },
            outcome: {
                en: "Admitted to master's program",
                vi: "Trúng tuyển chương trình thạc sĩ",
                zh: "被录取参加硕士项目",
            },
        },
    ],
    blogTabs: [
        { id: "all", label: { en: "All", vi: "Tất cả", zh: "全部" }, slug: "all" },
        { id: "scholarship", label: { en: "Scholarship", vi: "Học bổng", zh: "奖学金" }, slug: "hoc-bong" },
        { id: "guide", label: { en: "Guide", vi: "Hướng dẫn", zh: "指南" }, slug: "huong-dan" },
    ],
    community: [
        {
            id: "c1",
            name: "Facebook",
            description: "Cập nhật sàn học bổng và chia sẻ kinh nghiệm.",
            href: "https://facebook.com",
            bannerImage: "/images/community-facebook.webp",
        },
        {
            id: "c2",
            name: "TikTok",
            description: "Video ngắn về quy trình và tips nhanh.",
            href: "https://tiktok.com",
            bannerImage: "/images/community-tiktok.webp",
        },
        {
            id: "c3",
            name: "YouTube",
            description: "Hướng dẫn chi tiết và webinar.",
            href: "https://youtube.com",
            bannerImage: "/images/community-youtube.webp",
        },
    ],
    leadForm: {
        title: "Đăng ký đánh giá hồ sơ",
        subtitle: "Nhận lộ trình cá nhân hóa trong 24h",
        submitText: "Nhận đánh giá hồ sơ miễn phí",
        loadingText: "Đang xử lý...",
    },
};
