<template>
  <div class="<%= pageName %>-container">
    <div class="<%= pageName %>-box">
      <div class="page-header">
        <div class="header-title"><%= pageTitle %></div>
        <div class="header-search-operate">
          <div class="header-search">
            <!-- 查询表单 -->
            <el-form
              inline
              ref="searchDom"
              size="mini"
              :model="searchModel"
              <% if (search.labelWidth) { %>
              label-width="<%= search.labelWidth %>px"
              <% } %>
              label-position="<%= search.labelPosition %>"
            >

              <% _.forEach(search.fieldInfos, field => { %>
                  <el-form-item
                    label="<%= field.label %>: "
                    prop="<%= field.name %>"
                    <% if (field.labelWidth) { %>
                    label-width="<%= field.labelWidth %>px"
                    <% } %>
                  >
                    
                      <% if (field.formType === 'input') { %>
                        <el-input
                          v-model="searchModel.<%= field.name %>"
                          placeholder="请输入<%= field.label %>"
                          :clearable="<%= field.clearable %>"
                        ></el-input>
                      <% } %>

                      <% if (field.formType === 'select') { %>
                        <el-select
                          v-model="searchModel.<%= field.name %>"
                          placeholder="请选择<%= field.label %>"
                          :clearable="<%= field.clearable %>"
                        >
                          <el-option
                            v-for="(option, index) of searchOptions.<%= field.name %>"
                            :key="index"
                            :disabled="option.disabled"
                            :label="option.label"
                            :value="option.value"
                          ></el-option>
                        </el-select>
                      <% } %>
                    
                  </el-form-item>
              <% })  %>
              <el-form-item label=" " label-width="20px">
                <el-button @click="toSearch" type="primary">查询</el-button>
                <el-button @click="toReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="header-operate"></div>
        </div>
      </div>

      <div class="page-content">
        <!-- 表格 -->
        <div class="content-table">
          <el-table
            border
            size="mini"
            style="width: 100%"
            :data="tablePager.data"
            :default-sort="{ prop: '<%= table.sortField %>', order: '<%= table.sortType %>' }"
            v-loading="tablePager.loading"
            @sort-change="sortChange"
            @selection-change="selectionChange"
          >
            <% if (table.selection) { %>
            <el-table-column type="selection" width="55" v-if="<%= table.selection %>" />
            <% } %>
            <% if (table.index) { %>
            <el-table-column>
              <template #default="scope">
                {{ tablePager.pageSize * (tablePager.pageNum - 1) + scope.$index + 1 }}
              </template>
            </el-table-column>
            <% } %>
            <el-table-column
              v-for="column of columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :sortable="column.sortable ? 'custom' : false "
              :show-overflow-tooltip="column.showOverflowTooltip"
              :width="column.width"
            >
              <template #default="scope">
                {{ column.formatter ? column.formatter(scope.row[column.prop]) : scope.row[column.prop] }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="content-pager">
          <el-pagination
            small
            background
            layout="total, prev, pager, next, sizes, jumper, ->"
            v-model:current-page="tablePager.pageNum"
            :page-size="tablePager.pageSize"
            :total="tablePager.total"
            @size-change="pageSizeChange"
            @current-change="pageNumChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useTablePager from './useTablePager'
import useOptions from './useOptions'

export default defineComponent({
  name: '<%= pageName %>',
  setup () {
    const columns = <%= JSON.stringify(table.columns) %>

    const searchOptions = useOptions()

    const {
      tablePager,
      pageSizeChange,
      pageNumChange,
      sortChange,
      selectionChange,

      searchModel,

      toSearch,
      toReset
    } = useTablePager()

    return {
      searchOptions,

      columns,
      
      tablePager,
      pageSizeChange,
      pageNumChange,
      sortChange,
      selectionChange,

      searchModel,

      toSearch,
      toReset
    }
  }
})
</script>

<style lang="scss">
.<%= pageName %>-container {
  .<%= pageName %>-box {
    padding: 10px 15px;
    .page-header {
      .header-title {
        margin-bottom: 16px;
        font-size: 16px;
        color: #5e6b7a;
        font-weight: 700;
      }

      .header-search-operate {
        display: flex;
        justify-content: space-between;
      }
    }

    .page-content {
      .content-table {}

      .content-pager {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
