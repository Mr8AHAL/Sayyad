import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- Global Lists, Folders, Tags ---
export const listFolders = sqliteTable('list_folders', {
  id: text('id').primaryKey(),
  moduleName: text('module_name').notNull(),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
});

export const lists = sqliteTable('lists', {
  id: text('id').primaryKey(),
  moduleName: text('module_name').notNull(),
  folderId: text('folder_id').references(() => listFolders.id),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
});

export const listItems = sqliteTable('list_items', {
  id: text('id').primaryKey(),
  listId: text('list_id').notNull().references(() => lists.id),
  moduleName: text('module_name').notNull(),
  recordId: text('record_id').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  moduleName: text('module_name').notNull(),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
});

export const tagItems = sqliteTable('tag_items', {
  id: text('id').primaryKey(),
  tagId: text('tag_id').notNull().references(() => tags.id),
  moduleName: text('module_name').notNull(),
  recordId: text('record_id').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// --- Fishermen Module ---
export const fishermen = sqliteTable('fishermen', {
  id: text('id').primaryKey(),
  fishermanCode: integer('fisherman_code').notNull(), // شناسه صیاد
  fullName: text('full_name').notNull(),
  registrationNumber: text('registration_number').notNull(), // e.g. 73/1234
  registrationFolderName: text('registration_folder_name').notNull(), // e.g. 73-1234
  classificationDateJalali: text('classification_date_jalali').notNull(),
  classificationDateGregorian: text('classification_date_gregorian').notNull(),
  phone: text('phone'),
  fatherName: text('father_name'),
  birthDateJalali: text('birth_date_jalali'),
  birthDateGregorian: text('birth_date_gregorian'),
  nationalCode: text('national_code'),
  fishingArea: text('fishing_area'),
  fuelStation: text('fuel_station'),
  paymentStatusTag: text('payment_status_tag'), // priority | good_payer | late_payer | careless
  internalNote: text('internal_note'),
  engineNumber: text('engine_number'),
  engineType: text('engine_type'),
  enginePower: text('engine_power'),
  manualPinned: integer('manual_pinned', { mode: 'boolean' }).default(false),
  publicInvoiceToken: text('public_invoice_token').unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
});

export const fishermanFiles = sqliteTable('fisherman_files', {
  id: text('id').primaryKey(),
  fishermanId: text('fisherman_id').notNull().references(() => fishermen.id),
  fileType: text('file_type').notNull(), 
  // profile | national_card | tasht_invoice | sanad | classification | gol | captain_card | engine | reflector | metal_plate
  originalName: text('original_name').notNull(),
  storedName: text('stored_name').notNull(),
  filePath: text('file_path').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// --- Traffic Checklist Module ---
export const trafficChecklistItems = sqliteTable('traffic_checklist_items', {
  id: text('id').primaryKey(),
  fishermanId: text('fisherman_id').notNull().references(() => fishermen.id),
  checklistStatus: text('checklist_status').default('pending').notNull(), // pending | done
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false),
  isCopied: integer('is_copied', { mode: 'boolean' }).default(false),
  copiedFromId: text('copied_from_id'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// --- Invoices Module ---
export const invoiceMonthSettings = sqliteTable('invoice_month_settings', {
  id: text('id').primaryKey(),
  yearJalali: integer('year_jalali').notNull(),
  monthNumber: integer('month_number').notNull(),
  monthName: text('month_name').notNull(),
  fixedAmount: real('fixed_amount').default(0).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  fishermanId: text('fisherman_id').notNull().references(() => fishermen.id),
  yearJalali: integer('year_jalali').notNull(),
  monthNumber: integer('month_number').notNull(),
  monthName: text('month_name').notNull(),
  invoiceType: text('invoice_type').notNull(), // fixed | variable | exempt
  totalAmount: real('total_amount').default(0).notNull(),
  paidAmount: real('paid_amount').default(0).notNull(),
  remainingAmount: real('remaining_amount').default(0).notNull(),
  previousCreditAmount: real('previous_credit_amount').default(0),
  usedCreditAmount: real('used_credit_amount').default(0),
  newCreditAmount: real('new_credit_amount').default(0),
  finalBalanceAmount: real('final_balance_amount').default(0), // negative means credit
  invoiceStatus: text('invoice_status').default('unpaid').notNull(), // unpaid | paid | exempt | needs_amount | paid_with_credit
  paymentBehaviorTag: text('payment_behavior_tag'), // priority | good_payer | late_payer | careless
  paymentDateJalali: text('payment_date_jalali'),
  paymentDateGregorian: text('payment_date_gregorian'),
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const invoicePayments = sqliteTable('invoice_payments', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull().references(() => invoices.id),
  fishermanId: text('fisherman_id').notNull().references(() => fishermen.id),
  yearJalali: integer('year_jalali').notNull(),
  monthNumber: integer('month_number').notNull(),
  monthName: text('month_name').notNull(),
  amount: real('amount').notNull(),
  paymentMethod: text('payment_method'), // cash | card_to_card | pos | bank_transfer | other
  trackingCode: text('tracking_code'),
  payerAccountName: text('payer_account_name'),
  paymentDateJalali: text('payment_date_jalali').notNull(),
  paymentDateGregorian: text('payment_date_gregorian').notNull(),
  paymentTime: text('payment_time'),
  paymentNote: text('payment_note'),
  note: text('note'),
  isCancelled: integer('is_cancelled', { mode: 'boolean' }).default(false),
  cancelledAtJalali: text('cancelled_at_jalali'),
  cancelledAtGregorian: text('cancelled_at_gregorian'),
  cancelReason: text('cancel_reason'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const invoiceCredits = sqliteTable('invoice_credits', {
  id: text('id').primaryKey(),
  fishermanId: text('fisherman_id').notNull().references(() => fishermen.id),
  invoiceId: text('invoice_id'),
  yearJalali: integer('year_jalali'),
  monthNumber: integer('month_number'),
  monthName: text('month_name'),
  previousCreditAmount: real('previous_credit_amount').default(0),
  paymentAmount: real('payment_amount').default(0),
  usedCreditAmount: real('used_credit_amount').default(0),
  newCreditAmount: real('new_credit_amount').default(0),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const invoiceActivityLogs = sqliteTable('invoice_activity_logs', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id'),
  fishermanId: text('fisherman_id'),
  actionType: text('action_type').notNull(), 
  oldValue: text('old_value'),
  newValue: text('new_value'),
  description: text('description'),
  createdAtJalali: text('created_at_jalali').notNull(),
  createdAtGregorian: text('created_at_gregorian').notNull(),
});

// --- SMS Panel Module ---
export const smsSettings = sqliteTable('sms_settings', {
  id: text('id').primaryKey(),
  apiKey: text('api_key'),
  lineNumber: text('line_number'),
  isActive: integer('is_active', { mode: 'boolean' }).default(false),
  autoReminderEnabled: integer('auto_reminder_enabled', { mode: 'boolean' }).default(false),
  cronToken: text('cron_token'),
  defaultClassificationMessage: text('default_classification_message'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const smsTemplates = sqliteTable('sms_templates', {
  id: text('id').primaryKey(),
  templateKey: text('template_key').notNull().unique(), // general | classification_reminder | invoice | debt | paid
  title: text('title').notNull(),
  messageText: text('message_text').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const smsMessages = sqliteTable('sms_messages', {
  id: text('id').primaryKey(),
  fishermanId: text('fisherman_id').references(() => fishermen.id),
  phone: text('phone').notNull(),
  messageText: text('message_text').notNull(),
  messageType: text('message_type').notNull(), // general | targeted | classification_reminder | invoice | manual
  sendStatus: text('send_status').default('pending'), // pending | sent | failed
  apiResponse: text('api_response'),
  sentAtJalali: text('sent_at_jalali'),
  sentAtGregorian: text('sent_at_gregorian'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const smsReminders = sqliteTable('sms_reminders', {
  id: text('id').primaryKey(),
  fishermanId: text('fisherman_id').notNull().references(() => fishermen.id),
  reminderType: text('reminder_type').notNull(),
  lastSentAtJalali: text('last_sent_at_jalali'),
  lastSentAtGregorian: text('last_sent_at_gregorian'),
  renewalStatus: text('renewal_status').default('unknown'), // unknown | renewed | not_renewed
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
