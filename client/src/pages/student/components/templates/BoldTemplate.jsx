import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const buildStyles = (accent = '#2563eb') => StyleSheet.create({
  page:         { fontFamily: 'Helvetica', fontSize: 9, backgroundColor: '#fff' },
  header:       { flexDirection: 'row', backgroundColor: accent, height: 120, alignItems: 'center', paddingHorizontal: 30 },
  headerText:   { flex: 1 },
  headerName:   { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#fff', marginBottom: 4 },
  headerTitle:  { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  photoWrap:    { width: 85, height: 85, borderRadius: 42.5, borderWidth: 3, borderColor: '#fff', overflow: 'hidden', marginLeft: 15 },
  photoInitials:{ width: 85, height: 85, borderRadius: 42.5, borderWidth: 3, borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginLeft: 15 },
  photoInitTxt: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#fff' },
  photo:        { width: 85, height: 85 },
  body:         { flexDirection: 'row' },
  leftCol:      { width: '35%', backgroundColor: '#f8f8f8', padding: 20 },
  rightCol:     { width: '65%', backgroundColor: '#fff', padding: 20 },
  sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  sectionWrap:  { marginBottom: 18 },
  contactItem:  { fontSize: 9, color: '#333', marginBottom: 4, lineHeight: 1.4 },
  chipWrap:     { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  chip:         { fontSize: 9, fontFamily: 'Helvetica-Bold', color: accent, backgroundColor: `rgba(37,99,235,0.1)`, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4, marginRight: 4, marginBottom: 4 },
  bodyText:     { fontSize: 9, color: '#444', lineHeight: 1.6 },
  certItem:     { fontSize: 9, color: '#444', marginBottom: 2 },
  rSectionTitle:{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rSquare:      { width: 6, height: 6, backgroundColor: accent, marginRight: 7 },
  rSectionText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1.5 },
  timelineWrap: { flexDirection: 'row', marginBottom: 10 },
  timelineDot:  { width: 7, height: 7, borderRadius: 3.5, backgroundColor: accent, marginTop: 3, marginRight: 10 },
  timelineBody: { flex: 1 },
  expTitleRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  expTitle:     { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111' },
  datePill:     { fontSize: 8, color: '#888', backgroundColor: '#f0f0f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  expCompany:   { fontSize: 9, fontStyle: 'italic', color: '#666', marginBottom: 3 },
  expDesc:      { fontSize: 9, color: '#444', lineHeight: 1.5 },
  eduDegree:    { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111' },
  eduInst:      { fontSize: 9, color: '#666', marginBottom: 4 },
  rSectionWrap: { marginBottom: 18 },
});

const getInitials = (name = '') => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

export const BoldTemplate = ({ data = {} }) => {
  const { name='', jobTitle='', email='', phone='', location='', linkedin='', github='',
    summary='', photo=null, accentColor='#2563eb',
    experience=[], education=[], skills=[], languages=[], certifications=[] } = data;

  const s = buildStyles(accentColor);

  // chip style needs dynamic accent
  const chipStyle = {
    fontSize: 9, fontFamily: 'Helvetica-Bold', color: accentColor,
    backgroundColor: accentColor + '26', // 15% opacity hex
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4,
    marginRight: 4, marginBottom: 4
  };

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerText}>
            <Text style={s.headerName}>{name || 'Your Name'}</Text>
            {jobTitle ? <Text style={s.headerTitle}>{jobTitle}</Text> : null}
          </View>
          {photo
            ? <View style={s.photoWrap}><Image src={photo} style={s.photo} /></View>
            : name
              ? <View style={s.photoInitials}><Text style={s.photoInitTxt}>{getInitials(name)}</Text></View>
              : null
          }
        </View>

        {/* Body */}
        <View style={s.body}>
          {/* Left */}
          <View style={s.leftCol}>
            {[email, phone, location, linkedin, github].some(Boolean) ? (
              <View style={s.sectionWrap}>
                <Text style={s.sectionTitle}>Contact</Text>
                {email    ? <Text style={s.contactItem}>{email}</Text> : null}
                {phone    ? <Text style={s.contactItem}>{phone}</Text> : null}
                {location ? <Text style={s.contactItem}>{location}</Text> : null}
                {linkedin ? <Text style={s.contactItem}>{linkedin}</Text> : null}
                {github   ? <Text style={s.contactItem}>{github}</Text> : null}
              </View>
            ) : null}

            {skills.length > 0 ? (
              <View style={s.sectionWrap}>
                <Text style={s.sectionTitle}>Skills</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {skills.map((sk, i) => <Text key={i} style={chipStyle}>{sk}</Text>)}
                </View>
              </View>
            ) : null}

            {languages.length > 0 ? (
              <View style={s.sectionWrap}>
                <Text style={s.sectionTitle}>Languages</Text>
                {languages.map((l, i) => <Text key={i} style={s.contactItem}>{l}</Text>)}
              </View>
            ) : null}

            {certifications.length > 0 ? (
              <View style={s.sectionWrap}>
                <Text style={s.sectionTitle}>Certifications</Text>
                {certifications.map((c, i) => <Text key={i} style={s.certItem}>• {c}</Text>)}
              </View>
            ) : null}
          </View>

          {/* Right */}
          <View style={s.rightCol}>
            {summary ? (
              <View style={s.rSectionWrap}>
                <View style={s.rSectionTitle}>
                  <View style={s.rSquare} />
                  <Text style={s.rSectionText}>Summary</Text>
                </View>
                <Text style={s.bodyText}>{summary}</Text>
              </View>
            ) : null}

            {experience.filter(e => e.jobTitle || e.company).length > 0 ? (
              <View style={s.rSectionWrap}>
                <View style={s.rSectionTitle}>
                  <View style={s.rSquare} />
                  <Text style={s.rSectionText}>Experience</Text>
                </View>
                {experience.filter(e => e.jobTitle || e.company).map((e, i) => (
                  <View key={i} style={s.timelineWrap}>
                    <View style={s.timelineDot} />
                    <View style={s.timelineBody}>
                      <View style={s.expTitleRow}>
                        <Text style={s.expTitle}>{e.jobTitle}</Text>
                        <Text style={s.datePill}>{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</Text>
                      </View>
                      {e.company ? <Text style={s.expCompany}>{e.company}</Text> : null}
                      {e.description ? <Text style={s.expDesc}>{e.description}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            ) : null}

            {education.filter(e => e.degree || e.institution).length > 0 ? (
              <View style={s.rSectionWrap}>
                <View style={s.rSectionTitle}>
                  <View style={s.rSquare} />
                  <Text style={s.rSectionText}>Education</Text>
                </View>
                {education.filter(e => e.degree || e.institution).map((e, i) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <View style={s.expTitleRow}>
                      <Text style={s.eduDegree}>{e.degree}</Text>
                      <Text style={s.datePill}>{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</Text>
                    </View>
                    {e.institution ? <Text style={s.eduInst}>{e.institution}</Text> : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BoldTemplate;
