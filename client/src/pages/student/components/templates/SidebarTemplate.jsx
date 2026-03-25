import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const buildStyles = (accent = '#2563eb') => StyleSheet.create({
  page:         { flexDirection: 'row', fontFamily: 'Helvetica', fontSize: 9, backgroundColor: '#fff' },
  sidebar:      { width: '32%', backgroundColor: accent, padding: 20, flexDirection: 'column' },
  content:      { width: '68%', padding: 25, backgroundColor: '#fff' },

  photoCircle:  { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'center', marginBottom: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  photoInitials:{ fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#fff' },
  photo:        { width: 80, height: 80, borderRadius: 40 },
  sName:        { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#fff', textAlign: 'center', marginBottom: 3 },
  sJobTitle:    { fontSize: 9, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 12 },
  sDivider:     { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', marginBottom: 12 },

  sSectionTitle:{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  sItem:        { fontSize: 9, color: '#fff', marginBottom: 4, lineHeight: 1.4 },
  sSkillBar:    { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 3, marginBottom: 6 },

  cSectionTitle:{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: accent, textTransform: 'uppercase', letterSpacing: 1.5, borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 8, marginBottom: 10 },
  cSectionWrap: { marginBottom: 18 },
  expRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  expTitle:     { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111' },
  expDates:     { fontSize: 9, color: '#999' },
  expCompany:   { fontSize: 10, fontStyle: 'italic', color: '#666', marginBottom: 3 },
  expDesc:      { fontSize: 9, color: '#444', lineHeight: 1.5 },
  eduDegree:    { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111' },
  eduInst:      { fontSize: 9, color: '#666', marginBottom: 4 },
  bodyText:     { fontSize: 9, color: '#444', lineHeight: 1.6 },
  certItem:     { fontSize: 9, color: '#444', marginBottom: 2 },
  expWrap:      { marginBottom: 10 },
});

const getInitials = (name = '') => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

export const SidebarTemplate = ({ data = {} }) => {
  const { name='', jobTitle='', email='', phone='', location='', linkedin='', github='',
    summary='', photo=null, accentColor='#2563eb',
    experience=[], education=[], skills=[], languages=[], certifications=[] } = data;

  const s = buildStyles(accentColor);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Sidebar */}
        <View style={s.sidebar}>
          <View style={s.photoCircle}>
            {photo
              ? <Image src={photo} style={s.photo} />
              : <Text style={s.photoInitials}>{getInitials(name)}</Text>
            }
          </View>
          {name ? <Text style={s.sName}>{name}</Text> : null}
          {jobTitle ? <Text style={s.sJobTitle}>{jobTitle}</Text> : null}
          <View style={s.sDivider} />

          {/* Contact */}
          {[email, phone, location, linkedin, github].some(Boolean) ? (
            <View style={{ marginBottom: 14 }}>
              <Text style={s.sSectionTitle}>Contact</Text>
              {email    ? <Text style={s.sItem}>{email}</Text> : null}
              {phone    ? <Text style={s.sItem}>{phone}</Text> : null}
              {location ? <Text style={s.sItem}>{location}</Text> : null}
              {linkedin ? <Text style={s.sItem}>{linkedin}</Text> : null}
              {github   ? <Text style={s.sItem}>{github}</Text> : null}
            </View>
          ) : null}

          {/* Skills */}
          {skills.length > 0 ? (
            <View style={{ marginBottom: 14 }}>
              <Text style={s.sSectionTitle}>Skills</Text>
              {skills.map((sk, i) => (
                <View key={i}>
                  <Text style={s.sItem}>{sk}</Text>
                  <View style={s.sSkillBar} />
                </View>
              ))}
            </View>
          ) : null}

          {/* Languages */}
          {languages.length > 0 ? (
            <View>
              <Text style={s.sSectionTitle}>Languages</Text>
              {languages.map((l, i) => <Text key={i} style={s.sItem}>{l}</Text>)}
            </View>
          ) : null}
        </View>

        {/* Content */}
        <View style={s.content}>
          {summary ? (
            <View style={s.cSectionWrap}>
              <Text style={s.cSectionTitle}>Summary</Text>
              <Text style={s.bodyText}>{summary}</Text>
            </View>
          ) : null}

          {experience.filter(e => e.jobTitle || e.company).length > 0 ? (
            <View style={s.cSectionWrap}>
              <Text style={s.cSectionTitle}>Experience</Text>
              {experience.filter(e => e.jobTitle || e.company).map((e, i) => (
                <View key={i} style={s.expWrap}>
                  <View style={s.expRow}>
                    <Text style={s.expTitle}>{e.jobTitle}</Text>
                    <Text style={s.expDates}>{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</Text>
                  </View>
                  {e.company ? <Text style={s.expCompany}>{e.company}</Text> : null}
                  {e.description ? <Text style={s.expDesc}>{e.description}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {education.filter(e => e.degree || e.institution).length > 0 ? (
            <View style={s.cSectionWrap}>
              <Text style={s.cSectionTitle}>Education</Text>
              {education.filter(e => e.degree || e.institution).map((e, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <View style={s.expRow}>
                    <Text style={s.eduDegree}>{e.degree}</Text>
                    <Text style={s.expDates}>{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</Text>
                  </View>
                  {e.institution ? <Text style={s.eduInst}>{e.institution}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {certifications.length > 0 ? (
            <View style={s.cSectionWrap}>
              <Text style={s.cSectionTitle}>Certifications</Text>
              {certifications.map((c, i) => <Text key={i} style={s.certItem}>• {c}</Text>)}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
};

export default SidebarTemplate;
