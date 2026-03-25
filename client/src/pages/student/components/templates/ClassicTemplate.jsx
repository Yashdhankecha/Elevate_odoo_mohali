import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const s = StyleSheet.create({
  page:        { fontFamily: 'Helvetica', fontSize: 9, color: '#222', backgroundColor: '#fff', padding: 40 },
  name:        { fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#111', marginBottom: 3 },
  jobTitle:    { fontSize: 13, color: '#666', marginBottom: 6 },
  contactLine: { fontSize: 9, color: '#888', marginBottom: 24 },
  sectionWrap: { marginBottom: 16 },
  sectionTitle:{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 5 },
  sectionLine: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 9 },
  expRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  expTitle:    { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111' },
  expDates:    { fontSize: 9, color: '#888' },
  expCompany:  { fontSize: 10, fontStyle: 'italic', color: '#666', marginBottom: 3 },
  expDesc:     { fontSize: 9, color: '#444', lineHeight: 1.5 },
  eduRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  eduDegree:   { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111' },
  eduYear:     { fontSize: 9, color: '#888' },
  eduInst:     { fontSize: 10, color: '#666', marginBottom: 4 },
  skillsText:  { fontSize: 9, color: '#444', lineHeight: 1.6 },
  certItem:    { fontSize: 9, color: '#444', marginBottom: 2 },
});

const Section = ({ title, children }) => (
  <View style={s.sectionWrap}>
    <Text style={s.sectionTitle}>{title}</Text>
    <View style={s.sectionLine} />
    {children}
  </View>
);

export const ClassicTemplate = ({ data = {} }) => {
  const { name='', jobTitle='', email='', phone='', location='', linkedin='', summary='',
    experience=[], education=[], skills=[], certifications=[] } = data;

  const contact = [email, phone, location, linkedin].filter(Boolean).join(' | ');

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{name || 'Your Name'}</Text>
        {jobTitle ? <Text style={s.jobTitle}>{jobTitle}</Text> : null}
        {contact ? <Text style={s.contactLine}>{contact}</Text> : null}

        {summary ? (
          <Section title="Summary">
            <Text style={s.expDesc}>{summary}</Text>
          </Section>
        ) : null}

        {experience.filter(e => e.jobTitle || e.company).length > 0 ? (
          <Section title="Experience">
            {experience.filter(e => e.jobTitle || e.company).map((e, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={s.expRow}>
                  <Text style={s.expTitle}>{e.jobTitle}</Text>
                  <Text style={s.expDates}>{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</Text>
                </View>
                {e.company ? <Text style={s.expCompany}>{e.company}</Text> : null}
                {e.description ? <Text style={s.expDesc}>{e.description}</Text> : null}
              </View>
            ))}
          </Section>
        ) : null}

        {education.filter(e => e.degree || e.institution).length > 0 ? (
          <Section title="Education">
            {education.filter(e => e.degree || e.institution).map((e, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={s.eduRow}>
                  <Text style={s.eduDegree}>{e.degree}</Text>
                  <Text style={s.eduYear}>{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</Text>
                </View>
                {e.institution ? <Text style={s.eduInst}>{e.institution}</Text> : null}
              </View>
            ))}
          </Section>
        ) : null}

        {skills.length > 0 ? (
          <Section title="Skills">
            <Text style={s.skillsText}>{skills.join(', ')}</Text>
          </Section>
        ) : null}

        {certifications.length > 0 ? (
          <Section title="Certifications">
            {certifications.map((c, i) => <Text key={i} style={s.certItem}>• {c}</Text>)}
          </Section>
        ) : null}
      </Page>
    </Document>
  );
};

export default ClassicTemplate;
