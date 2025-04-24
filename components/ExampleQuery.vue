<template>
  <div>
    <div v-if="pending">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <div v-else>
      <h2>Результаты запроса:</h2>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils'

const { $graphql } = useNuxtApp()

const query = gql`
  query ExampleQuery {
    # Замените на ваш реальный запрос
    posts {
      nodes {
        id
        title
        date
      }
    }
  }
`

const { data, pending, error } = await useAsyncData('posts', () => 
  $graphql.default.request(query)
)
</script> 