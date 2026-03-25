import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const s = StyleSheet.create({
  page:         { fontFamily: 'Helvetica', fontSize: 9, color: '#222', backgroundColor: '#fff', paddingHorizontal: 50, paddingVertical: 45 },
  headerWrap:   { marginBottom: 24 },
  nameLine:     { flexDirection: 'row', marginBottom: 4 },
  nameLight:    { fontSize: 30, fontFamily: 'Helvetica', color: '#111' },
  nameBold:     { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#111' },
  headerSub:    { fontSize: 10, color: '#888', marginBottom: 3 },
  headerContact:{ fontSize: 9, color: '#aaa' },
  twoCol:       { flexDirection: 'row' },
  leftCol:      { width: '22%', paddingRight: 8, paddingTop: 2 },
  rightCol:     { width: '78%' },
  sectionWrap:  { flexDirection: 'row', marginBottom: 16 },
  sectionLabel: { width: '22%', fontSize: 9, color: '#aaa', textTransform: 'uppercase', letterSpacing: 3, textAlign: 'right', paddingRight: 16, paddingTop: 2 },
  sectionBody:  { width: '78%' },
  expCompanyRow:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expCompany:   { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111' },
  expDates:     { fontSize: 9, color: '#aaa' },
  expTitle:     { fontSize: 9, fontStyle: 'italic', color: '#555', marginBottom: 3 },
  expDesc:      { fontSize: 9, color: '#444', lineHeight: 1.6, marginBottom: 8 },
  eduRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  eduDegree:    { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111' },
  eduYear:      { fontSize: 9, color: '#aaa' },
  eduInst:      { fontSize: 9, color: '#555', marginBottom: 6 },
  bodyText:     { fontSize: 9, color: '#444', lineHeight: 1.7 },
  certItem:     { fontSize: 9, color: '#444', marginBottom: 2 },
});

const SectionRow = ({ label, children }) => (
  <View style={s.sectionWrap}>
    <Text style={s.sectionLabel}>{label}</Text>
    <View style={s.sectionBody}>{children}</View>
  </View>
);

export const MinimalTemplate = ({ data = {} }) => {
  const { name='', jobTitle='', email='', phone='', location='', linkedin='',
    summary='', experience=[], education=[], skills=[], certifications=[] } = data;

  const nameParts = (name || 'Your Name').trim().split(' ');
  const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0];
  const lastName  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const contact   = [email, phone, location, linkedin].filter(Boolean).join('  ·  ');

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerWrap}>
          <View style={s.nameLine}>
            <Text style={s.nameLight}>{firstName} </Text>
            {lastName ? <Text style={s.nameBold}>{lastName}</Text> : null}
          </View>
          {jobTitle ? <Text style={s.headerSub}>{jobTitle}</Text> : null}
          {contact  ? <Text style={s.headerContact}>{contact}</Text> : null}
        </View>

        {summary ? (
          <SectionRow label="About">
            <Text style={s.bodyText}>{summary}</Text>
          </SectionRow>
        ) : null}

        {experience.filter(e => e.jobTitle || e.company).length > 0 ? (
          <SectionRow label="Experience">
            {experience.filter(e => e.jobTitle || e.company).map((e, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={s.expCompanyRow}>
                  <Text style={s.expCompany}>{e.company}</Text>
                  <Text style={s.expDates}>{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</Text>
                </View>
                {e.jobTitle ? <Text style={s.expTitle}>{e.jobTitle}</Text> : null}
                {e.description ? <Text style={s.expDesc}>{e.description}</Text> : null}
              </View>
            ))}
          </SectionRow>
        ) : null}

        {education.filter(e => e.degree || e.institution).length > 0 ? (
          <SectionRow label="Education">
            {education.filter(e => e.degree || e.institution).map((e, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={s.eduRow}>
                  <Text style={s.eduDegree}>{e.degree}</Text>
                  <Text style={s.eduYear}>{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</Text>
                </View>
                {e.institution ? <Text style={s.eduInst}>{e.institution}</Text> : null}
              </View>
            ))}
          </SectionRow>
        ) : null}

        {skills.length > 0 ? (
          <SectionRow label="Skills">
            <Text style={s.bodyText}>{skills.join(', ')}</Text>
          </SectionRow>
        ) : null}

        {certifications.length > 0 ? (
          <SectionRow label="Awards">
            {certifications.map((c, i) => <Text key={i} style={s.certItem}>{c}</Text>)}
          </SectionRow>
        ) : null}
      </Page>
    </Document>
  );
};

export default MinimalTemplate;
