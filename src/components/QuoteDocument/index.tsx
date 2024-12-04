import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Quote } from '../../types';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { 
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2',
      fontWeight: 'bold'
    }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Inter',
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 15
  },
  logo: {
    width: 142,
    height: 32
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: '#071640',
    fontFamily: 'Inter',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 4
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2970FF',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    padding: '3 0'
  },
  label: {
    width: '30%',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#374151'
  },
  value: {
    width: '70%',
    color: '#111827'
  },
  premiumBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2970FF',
    borderRadius: 4
  },
  premiumLabel: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  premiumValue: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20
  }
});

interface QuoteDocumentProps {
  quote: Quote;
}

export function QuoteDocument({ quote }: QuoteDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>PS Advisory</Text>
            <Text style={styles.subtitle}>Workers' Compensation Insurance Quote</Text>
          </View>
          <View>
            <Text>Quote #{quote.quoteNumber}</Text>
            <Text style={styles.subtitle}>
              Generated: {format(new Date(quote.createdAt), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Business Name:</Text>
            <Text style={styles.value}>{quote.businessInfo.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>FEIN:</Text>
            <Text style={styles.value}>{quote.businessInfo.fein}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Entity Type:</Text>
            <Text style={styles.value}>{quote.businessInfo.entityType}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coverage Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Effective Date:</Text>
            <Text style={styles.value}>
              {format(new Date(quote.effectiveDate), 'MMMM d, yyyy')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Expiration Date:</Text>
            <Text style={styles.value}>
              {format(new Date(quote.expirationDate), 'MMMM d, yyyy')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Details</Text>
          <View style={styles.premiumBox}>
            <View style={styles.row}>
              <Text style={styles.premiumLabel}>Total Annual Premium:</Text>
              <Text style={styles.premiumValue}>{formatCurrency(quote.premium)}</Text>
            </View>
          </View>
        </View>

        {quote.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text>{quote.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={{ color: '#2970FF', fontWeight: 'bold', marginBottom: 5 }}>
            PS Advisory Workers' Compensation Insurance Rating System
          </Text>
          <Text>
            This quote is valid for 30 days from {format(new Date(quote.createdAt), 'MMMM d, yyyy')}.
          </Text>
          <Text style={{ fontSize: 8, marginTop: 10, color: '#9ca3af' }}>
            This quote is based on the information provided and is subject to verification and underwriting review. 
            Final premium may vary based on actual payroll, claims experience, and other factors.
            This is not a binder of insurance coverage.
          </Text>
        </View>
      </Page>
    </Document>
  );
}