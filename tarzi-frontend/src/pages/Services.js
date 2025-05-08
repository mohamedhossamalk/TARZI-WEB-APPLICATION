import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  // أنماط CSS داخلية
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '1rem'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#666',
      maxWidth: '800px',
      margin: '0 auto'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '4rem'
    },
    serviceCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '2rem',
      textAlign: 'center',
      transition: 'transform 0.3s ease'
    },
    serviceIcon: {
      fontSize: '3rem',
      color: '#0d6efd',
      marginBottom: '1.5rem'
    },
    serviceTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1rem'
    },
    serviceDescription: {
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '1.5rem'
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#0d6efd',
      border: '1px solid #0d6efd',
      borderRadius: '4px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    },
    section: {
      marginBottom: '4rem'
    },
    sectionTitle: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '2rem',
      textAlign: 'center'
    },
    processSteps: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '2rem',
      position: 'relative',
      flexWrap: 'wrap'
    },
    processStep: {
      textAlign: 'center',
      flex: '1 1 200px',
      margin: '1rem',
      position: 'relative',
      zIndex: 1
    },
    stepNumber: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#0d6efd',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    stepTitle: {
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    stepDescription: {
      color: '#666',
      lineHeight: '1.6'
    },
    testimonials: {
      backgroundColor: '#f8f9fa',
      padding: '3rem 1rem',
      borderRadius: '8px'
    },
    testimonialsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    },
    testimonialCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      padding: '1.5rem'
    },
    testimonialText: {
      color: '#333',
      fontStyle: 'italic',
      marginBottom: '1rem',
      lineHeight: '1.6'
    },
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center'
    },
    authorAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#e9ecef',
      color: '#6c757d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '1rem',
      fontSize: '1.2rem'
    },
    authorInfo: {
      flex: 1
    },
    authorName: {
      fontWeight: 'bold',
      color: '#333'
    },
    authorRole: {
      color: '#6c757d',
      fontSize: '0.875rem'
    },
    cta: {
      textAlign: 'center',
      backgroundColor: '#0d6efd',
      color: 'white',
      padding: '3rem 1rem',
      borderRadius: '8px',
      marginTop: '4rem'
    },
    ctaTitle: {
      fontSize: '2rem',
      marginBottom: '1rem'
    },
    ctaSubtitle: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      opacity: 0.9
    },
    ctaButton: {
      backgroundColor: 'white',
      color: '#0d6efd',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem 2rem',
      fontSize: '1.1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      fontWeight: 'bold'
    },
    pricing: {
      backgroundColor: '#f8f9fa',
      padding: '3rem 1rem',
      borderRadius: '8px'
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    },
    pricingCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      padding: '2rem',
      textAlign: 'center'
    },
    pricingHeader: {
      borderBottom: '1px solid #eee',
      paddingBottom: '1.5rem',
      marginBottom: '1.5rem'
    },
    pricingTitle: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '0.5rem'
    },
    pricingPrice: {
      fontSize: '2.5rem',
      color: '#0d6efd',
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    pricingDescription: {
      color: '#666'
    },
    pricingFeatures: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '1.5rem'
    },
    pricingFeature: {
      padding: '0.5rem 0',
      borderBottom: '1px solid #eee'
    },
    faq: {
      marginTop: '4rem'
    },
    faqItem: {
      marginBottom: '1.5rem'
    },
    faqQuestion: {
      fontSize: '1.2rem',
      color: '#333',
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    faqAnswer: {
      color: '#666',
      lineHeight: '1.6'
    }
  };

  const services = [
    {
      id: 1,
      icon: '✂️',
      title: 'تفصيل حسب المقاس',
      description: 'نقدم خدمة تفصيل الملابس حسب مقاسات الجسم الدقيقة لضمان أعلى مستويات الراحة والأناقة.'
    },
    {
      id: 2,
      icon: '🧵',
      title: 'تعديل الملابس',
      description: 'نقدم خدمة تعديل وضبط الملابس الجاهزة لتناسب جسمك بشكل مثالي مع الحفاظ على جودتها الأصلية.'
    },
    {
      id: 3,
      icon: '👔',
      title: 'استشارات الأزياء',
      description: 'خبراؤنا في عالم الأزياء جاهزون لمساعدتك في اختيار ما يناسبك من ألوان وأنماط وتصاميم.'
    },
    {
      id: 4,
      icon: '👗',
      title: 'تصميم أزياء خاصة',
      description: 'خدمة تصميم أزياء فريدة من نوعها تعكس شخصيتك واحتياجاتك الخاصة، بالتعاون مع مصممي أزياء محترفين.'
    },
    {
      id: 5,
      icon: '🛍️',
      title: 'خدمة التسوق الشخصي',
      description: 'سنقوم باختيار الملابس المناسبة لك بناءً على ذوقك وأسلوبك واحتياجاتك، لتوفير وقتك وجهدك.'
    },
    {
      id: 6,
      icon: '🚚',
      title: 'خدمة التوصيل السريع',
      description: 'نقدم خدمة توصيل سريعة وآمنة لجميع الطلبات، مع إمكانية تتبع الطلب في الوقت الفعلي.'
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: 'أخذ القياسات',
      description: 'نقوم بأخذ قياسات دقيقة للجسم لضمان ملابس مناسبة تمامًا.'
    },
    {
      number: 2,
      title: 'اختيار التصميم',
      description: 'اختر من بين تصاميمنا المتنوعة أو قدم تصميمًا خاصًا بك.'
    },
    {
      number: 3,
      title: 'اختيار القماش',
      description: 'اختر من مجموعة واسعة من الأقمشة عالية الجودة بألوان وأنماط مختلفة.'
    },
    {
      number: 4,
      title: 'التفصيل والخياطة',
      description: 'يقوم خياطونا المهرة بتفصيل وخياطة الملابس بدقة وإتقان.'
    },
    {
      number: 5,
      title: 'المراجعة والتعديل',
      description: 'نقوم بمراجعة القطعة النهائية وإجراء أي تعديلات ضرورية.'
    },
    {
      number: 6,
      title: 'التوصيل',
      description: 'نقوم بتوصيل الملابس النهائية إلى باب منزلك.'
    }
  ];

  const testimonials = [
    {
      id: 1,
      text: 'خدمة ممتازة وجودة عالية للغاية. تفصيل البدلة كان دقيقًا جدًا ومناسبًا تمامًا لمقاساتي. سأتعامل معهم مرة أخرى بكل تأكيد.',
      name: 'أحمد محمد',
      role: 'مدير تنفيذي'
    },
    {
      id: 2,
      text: 'استفدت كثيرًا من خدمة الاستشارة في اختيار الملابس المناسبة لي. النتائج كانت مذهلة وحصلت على إطلالة جديدة تمامًا.',
      name: 'سارة أحمد',
      role: 'مصممة جرافيك'
    },
    {
      id: 3,
      text: 'خدمة التعديل ممتازة. قمت بتعديل بعض الملابس القديمة وأصبحت كأنها جديدة. أنصح بهم بشدة لجودة العمل والاحترافية.',
      name: 'محمد علي',
      role: 'مهندس معماري'
    }
  ];

  const pricingPlans = [
    {
      id: 1,
      title: 'تعديل بسيط',
      price: '200',
      description: 'لتعديلات بسيطة على الملابس الجاهزة',
      features: [
        'تضييق أو توسيع الملابس',
        'تقصير الأكمام أو البناطيل',
        'تغيير السوست أو الأزرار',
        'إصلاحات بسيطة',
        'توصيل عادي'
      ]
    },
    {
      id: 2,
      title: 'تفصيل قياسي',
      price: '750',
      description: 'لتفصيل ملابس جديدة بتصاميم قياسية',
      features: [
        'قياسات شخصية دقيقة',
        'اختيار من تصاميم متوفرة',
        'اختيار القماش والخامات',
        'جلسة قياس للتعديلات',
        'توصيل مجاني'
      ]
    },
    {
      id: 3,
      title: 'تصميم خاص',
      price: '1500',
      description: 'لتصميم وتفصيل ملابس فريدة خاصة بك',
      features: [
        'جلسة استشارة مع مصمم أزياء',
        'تصميم فريد حسب طلبك',
        'اختيار القماش والخامات الفاخرة',
        'جلستي قياس للتعديلات',
        'توصيل مجاني وأولوية'
      ]
    }
  ];

  const faqItems = [
    {
      id: 1,
      question: 'كم من الوقت يستغرق تفصيل ملابس جديدة؟',
      answer: 'يعتمد ذلك على نوع القطعة والتصميم. عادةً ما يستغرق تفصيل قميص من 5-7 أيام عمل، بينما تستغرق البدلة الكاملة 10-14 يوم عمل.'
    },
    {
      id: 2,
      question: 'هل يمكنني توفير القماش الخاص بي؟',
      answer: 'نعم، يمكنك إحضار القماش الخاص بك. سيقوم فريقنا بفحصه والتأكد من ملاءمته للتصميم المطلوب.'
    },
    {
      id: 3,
      question: 'كيف يتم أخذ المقاسات؟',
      answer: 'يمكنك زيارة أحد فروعنا لأخذ المقاسات بشكل دقيق من قبل متخصصين، أو يمكنك إرسال مقاساتك إذا كنت تعرف كيفية قياسها بشكل صحيح.'
    },
    {
      id: 4,
      question: 'هل يمكنني إجراء تعديلات بعد الانتهاء من التفصيل؟',
      answer: 'نعم، نقدم تعديلات مجانية خلال 15 يومًا من استلام الملابس لضمان رضاك التام.'
    },
    {
      id: 5,
      question: 'هل تقدمون خدمة التوصيل لجميع المناطق؟',
      answer: 'نعم، نقدم خدمة توصيل لجميع المحافظات الرئيسية. التوصيل مجاني للطلبات التي تزيد عن 1000 جنيه.'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>خدماتنا</h1>
        <p style={styles.subtitle}>نقدم مجموعة متنوعة من الخدمات المتميزة في مجال الأزياء والتفصيل لتلبية جميع احتياجاتك</p>
      </div>

      <div style={styles.servicesGrid}>
        {services.map(service => (
          <div key={service.id} style={styles.serviceCard}>
            <div style={styles.serviceIcon}>{service.icon}</div>
            <h3 style={styles.serviceTitle}>{service.title}</h3>
            <p style={styles.serviceDescription}>{service.description}</p>
            <Link to="/contact" style={styles.button}>
              احجز الآن
            </Link>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>كيف تعمل خدماتنا</h2>
        <div style={styles.processSteps}>
          {processSteps.map(step => (
            <div key={step.number} style={styles.processStep}>
              <div style={styles.stepNumber}>{step.number}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>باقاتنا</h2>
        <div style={styles.pricingGrid}>
          {pricingPlans.map(plan => (
            <div key={plan.id} style={styles.pricingCard}>
              <div style={styles.pricingHeader}>
                <h3 style={styles.pricingTitle}>{plan.title}</h3>
                <div style={styles.pricingPrice}>{plan.price} ج.م</div>
                <p style={styles.pricingDescription}>{plan.description}</p>
              </div>
              <ul style={styles.pricingFeatures}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={styles.pricingFeature}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <Link to="/contact" style={styles.button}>
                احجز الآن
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.testimonials}>
        <h2 style={styles.sectionTitle}>ما يقوله عملاؤنا</h2>
        <div style={styles.testimonialsGrid}>
          {testimonials.map(testimonial => (
            <div key={testimonial.id} style={styles.testimonialCard}>
              <p style={styles.testimonialText}>"{testimonial.text}"</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>
                  {testimonial.name.charAt(0)}
                </div>
                <div style={styles.authorInfo}>
                  <div style={styles.authorName}>{testimonial.name}</div>
                  <div style={styles.authorRole}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.faq}>
        <h2 style={styles.sectionTitle}>الأسئلة الشائعة</h2>
        <div>
          {faqItems.map(item => (
            <div key={item.id} style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>{item.question}</h3>
              <p style={styles.faqAnswer}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>مستعد لتجربة خدماتنا المتميزة؟</h2>
        <p style={styles.ctaSubtitle}>تواصل معنا الآن لحجز موعد أو للاستفسار عن أي من خدماتنا</p>
        <Link to="/contact" style={styles.ctaButton}>
          احجز الآن
        </Link>
      </div>
    </div>
  );
};

export default Services;